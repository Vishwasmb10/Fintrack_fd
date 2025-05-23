import { useState } from 'react';
import Card from './Card';
import { supabase } from '../src/supabaseClient';
import { updateNet } from '../jsFiles/dataFetchFunctions';

export default function Form(props){
    const [product,setProduct]=useState("");
    const [quantity,setQuantity]=useState("");
    const [amount,setAmount]=useState("");
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
        if(amount==="")
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

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-auto">
            <form autoComplete='off' className="space-y-4">
                <div>
                    <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Product
                    </label>
                    <input
                        type="text"
                        name="product"
                        id="product"
                        value={product}
                        onChange={handleProduct}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity
                    </label>
                    <input
                        type="text"
                        name="quantity"
                        id="quantity"
                        value={quantity}
                        onChange={handleQuantity}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div>
                    <label htmlFor="amt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Amount
                    </label>
                    <input
                        type="text"
                        name="amt"
                        id="amt"
                        value={amount}
                        onChange={handleAmount}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>

                <div className="flex space-x-2">
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            selected === 'credit'
                                ? 'bg-credit text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleToggle('credit')}
                    >
                        Credit
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            selected === 'debit'
                                ? 'bg-debit text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                        onClick={() => handleToggle('debit')}
                    >
                        Debit
                    </button>
                </div>

                <button
                    type="button"
                    onClick={saveHandle}
                    className="w-full py-2 px-4 bg-primary hover:bg-indigo-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                    Save
                </button>
            </form>
        </div>
    );
}