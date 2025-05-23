import style from '../stylesheets/Card.module.css';
import { supabase } from '../src/supabaseClient';
import { fetchDetails, updateNet } from '../jsFiles/dataFetchFunctions';
import { useState } from 'react';


export default function Card(props){
    // const date=new Date();
    // const today=(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);

    const [editState,setEditState]=useState(false);
    const [product,setProduct]=useState(props.product);
    const [quantity,setQuantity]=useState(props.quantity);
    const [amount,setAmount]=useState(props.amount);


    async function deleteCard(){
        // console.log(props.idAttribute);console.log(props.transactionType);console.log(props.idAttribute);
        const { error } = await supabase.from(props.transactionType).delete().eq('id', props.idAttribute);
    
        if (error) {
            console.log("Error deleting the row:", error);
        } else {
            console.log("Row deleted successfully!");
            alert('Deleted Successfully');
            fetchDetails(props.setCreditData,props.setDebitData,props.setNet,props.date);
        }
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

    async function editCard(){
        setEditState((state)=>!state);
    }

    async function submitCard(){
        editValues();
        setEditState((state)=>!state);

    }

    async function editValues(){
        let multipleAmounts=[];
        if(typeof amount=="string"){console.log("amount"+amount);multipleAmounts=amount.split("+")};
        if(multipleAmounts && multipleAmounts.length==0 ){
            const { data, error } = await supabase
            .from(props.transactionType)
            .update({ product: product,quantity:quantity,amount:amount})  // what you want to update
            .eq('id', props.idAttribute);                   // condition (like WHERE id = 1)

            if (error) {
            console.error('Update error:', error)
            } else {
            console.log('Update success:', data)
            updateNet(props.setNet,props.date);
            }
        }
        else{
            console.log(multipleAmounts);
            const sum=multipleAmounts.reduce((sum,ele)=>sum+Number(ele),0);
            setAmount(sum);
            const { data, error } = await supabase
            .from(props.transactionType)
            .update({ product: product,quantity:quantity,amount:sum})  // what you want to update
            .eq('id', props.idAttribute); 
            if (error) {
                console.error('Update error:', error)
            } 
            else {
                console.log('Update success:', data)
                updateNet(props.setNet,props.date);
            }                  
        }
    }

    const type=`${props.transactionType}`;

    return (<div className={`${style.card} ${type=='credit'?style.credit:style.debit}`}>
        
        {!editState?<><div className={style.info}>
            <p>Product</p>
            <p>{product}</p>
        </div><div className={style.info}>
                <p>Quantity</p>
                <p>{quantity}</p>
            </div><div className={style.info}>
                <p>Amount</p>
                <p>{amount}</p>
            </div>
            <div className={style.buttonContainer}>
                <button type="button" className={style.deleteBtn} onClick={deleteCard}>Delete</button>
                <button type="button" className={style.editBtn} onClick={editCard}>Edit</button>
            </div></>:<>
                <div className={style.cardEditFormContainer}>
                    <form className={style.cardEditFormC}>
                        <div className={style.info}>
                            <p>Product</p>
                            <input type='text' className={style.inputField} value={product} onChange={handleProduct}/>
                        </div>
                        <div className={style.info}>
                            <p>Quantity</p>
                            <input type='text' className={style.inputField} value={quantity} onChange={handleQuantity}/>
                        </div>
                        <div className={style.info}>
                            <p>Amount</p>
                            <input type='text' className={style.inputField} value={amount} onChange={handleAmount}/>
                        </div>
                        <div className={style.buttonContainer}>
                            <button type="button" className={style.submitBtn} onClick={submitCard}>Submit</button>  
                            <button type="button" className={style.editBtn} onClick={editCard}>Cancel</button>
                        </div>
                    </form>
                </div>
            </>
        }
        {/* <p>{props.idAttribute}</p> */}
    </div>);
}