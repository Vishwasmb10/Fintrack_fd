import { useState } from 'react';
import style from '../stylesheets/Form.module.css';
import Card from './Card';
import { supabase } from '../src/supabaseClient';

export default function Form(props){
    const [product,setProduct]=useState("");
    const [quantity,setQuantity]=useState();
    const [amount,setAmount]=useState();

    async function saveHandle(){
        if(product=="" || quantity=="" || amount=="" )
            return;
        
        const { error } = await supabase.from('debit').insert([{ product, quantity,amount }]);
        if (error) console.error('Error adding user:', error);
        else alert('Product added successfully!');
        props.setCards((cards)=>{return[...cards,<Card key="product" product={product} quantity={quantity} amount={amount} />]});
        
        setProduct("");
        setQuantity("");
        setAmount("");

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


    return (<div className={style.form}>
        <form autoComplete='off'>
            <label htmlFor="product">Product</label>
            <input type="text" name="product" id="product" value={product} onChange={handleProduct}/>

            <label htmlFor="quantity">Quantity</label>
            <input type="text" name="quantity" id="quantity" value={quantity} onChange={handleQuantity}/>

            <label htmlFor="amt">Amount</label>
            <input type="text" name="amt" id="amt" value={amount} onChange={handleAmount}/>
            
            <button type="button" onClick={()=>{saveHandle();}} className={style.saveBtn}>Save</button>
        </form>
    </div>);
}