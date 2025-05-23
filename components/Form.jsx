import { useState } from 'react';
import style from '../stylesheets/Form.module.css';
import Card from './Card';
import { supabase } from '../src/supabaseClient';
import { updateNet } from '../jsFiles/dataFetchFunctions';

export default function Form(props){
    const [product,setProduct]=useState("");
    const [quantity,setQuantity]=useState("");
    const [amount,setAmount]=useState();
    const [selected, setSelected]=useState('credit');

    // const dateObj=new Date();
    // const date=(`${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDate()}`);

    async function fetchIdValue(){
        let { data:id, error:idError } = await supabase.from(selected).select('id').order('id', { ascending: false }).limit(1);

        if (idError) {
            console.log("Error fetching max ID:", idError);
        } else {
            console.log("Max ID:", id.length > 0 ? id[0].id : null);
        }
        if(id.length===0){
            return 1;
        }
        const idValue=id[0].id+1;
        return idValue;
    }

    async function saveHandle(){
        if( amount=="" )
            return;
        const multipleAmounts=amount.split("+");
        const idValue=await fetchIdValue();

        if(multipleAmounts.length==1){
         const { error } = await supabase.from(selected).insert([{ id:idValue,date:props.date, product, quantity,amount }]);
         if (error) console.error('Error adding user:', error);
         else {
             //alert('Product added successfully!');
             props.setCards((cards)=>{return[...cards,<Card key={`${selected} ${idValue}`} product={product} quantity={quantity} amount={amount} idAttribute={idValue} transactionType={selected} setCreditData={props.setCreditData} setDebitData={props.setDebitData} setNet={props.setNet} date={props.date}/>]}); //setData={props.setData} setNet={props.setNet}
             updateNet(props.setNet,props.date);
        }
         
        }
        else{
            const sum=multipleAmounts.reduce((sum,ele)=>sum+Number(ele),0);
            console.log("sum:"+sum);
            const { error } = await supabase.from(selected).insert([{ id:idValue,date:props.date, product:"Multiple", quantity:1,amount:sum }]);
            if (error) console.error('Error adding user:', error);
            else {
                //alert('Product added successfully!');
                props.setCards((cards)=>{return[...cards,<Card key={`${selected} ${idValue}`} product={"Multiple"} quantity={1} amount={sum} idAttribute={idValue} transactionType={selected} setCreditData={props.setCreditData} setDebitData={props.setDebitData} setNet={props.setNet} date={props.date}/>]}); //setData={props.setData} setNet={props.setNet}
            }

        }
        // if (error) console.error('Error adding user:', error);
        // else {
        //     //alert('Product added successfully!');
        //     props.setCards((cards)=>{return[...cards,<Card key={`${selected} ${idValue}`} product={product} quantity={quantity} amount={amount} idAttribute={idValue} transactionType={selected} setCreditData={props.setCreditData} setDebitData={props.setDebitData} setNet={props.setNet} date={props.date}/>]}); //setData={props.setData} setNet={props.setNet}
        // }
        
        setProduct("");
        setQuantity("");
        setAmount("");
        props.setIsClicked(false);

    }

    function handleProduct(e){
        setProduct(e.target.value);
    }

    function handleQuantity(e){
        setQuantity(e.target.value);
    }

    function handleAmount(e){
        setAmount(e.target.value);
    }

    function handleToggle(value){
        setSelected(value)
    }


    return (<div className={style.form}>
        <form autoComplete='off'>


            <label htmlFor="product">Product</label>
            <input type="text" name="product" id="product" value={product} onChange={handleProduct}/>

            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" id="quantity" value={quantity} onChange={handleQuantity}/>

            <label htmlFor="amt">Amount</label>
            <input type="text" name="amt" id="amt" value={amount} onChange={handleAmount}/>
            
            <div className={style.toggleBtnContainer}>
                <button type="button" className={`${style.toggleBtn} ${selected=='credit'?style.activeBtn:''}`}  onClick={()=>{handleToggle('credit')}}>Credit</button>
                <button type="button" className={`${style.toggleBtn} ${selected=='debit'?style.activeBtn:''}`}  onClick={()=>{handleToggle('debit')}}>Debit</button>
            </div>
            <button type="button" onClick={()=>{saveHandle();}} className={style.saveBtn}>Save</button>
        </form>
    </div>);
}