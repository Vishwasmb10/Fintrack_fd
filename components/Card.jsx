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

    const type = props.transactionType;
    const borderColor = type === 'credit' ? 'border-l-4 border-l-credit' : 'border-l-4 border-l-debit';

    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${borderColor} transition-all duration-200`}>
        {!editState ? (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Product</p>
                <p className="font-medium">{product}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Quantity</p>
                <p className="font-medium">{quantity}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold mb-1">Amount</p>
                <p className="font-medium">{amount}</p>
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-4">
              <button 
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1.5 px-2 rounded text-sm font-medium transition-colors" 
                onClick={deleteCard}
              >
                Delete
              </button>
              <button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-2 rounded text-sm font-medium transition-colors" 
                onClick={editCard}
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <div className="p-2">
            <form className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Product</label>
                <input 
                  type='text' 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                  value={product} 
                  onChange={handleProduct}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Quantity</label>
                <input 
                  type='text' 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                  value={quantity} 
                  onChange={handleQuantity}
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Amount</label>
                <input 
                  type='text' 
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white" 
                  value={amount} 
                  onChange={handleAmount}
                />
              </div>
              <div className="flex justify-between gap-2 mt-4">
                <button 
                  type="button" 
                  className="flex-1 bg-primary hover:bg-indigo-600 text-white py-1.5 px-2 rounded text-sm font-medium transition-colors" 
                  onClick={submitCard}
                >
                  Submit
                </button>
                <button 
                  type="button" 
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1.5 px-2 rounded text-sm font-medium transition-colors" 
                  onClick={editCard}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        {/* <p>{props.idAttribute}</p> */}
      </div>
    );
}