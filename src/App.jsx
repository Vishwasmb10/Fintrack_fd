import { useEffect, useState } from 'react'
import style from '../stylesheets/App.module.css';
import Form from '../components/Form';
import Card from '../components/Card';
import Loader from '../components/Loader';
import sortTransactions from '../jsFiles/sortTransactions';
import { fetchDetails,updateNet,today } from '../jsFiles/dataFetchFunctions';
import Calendar from '../components/Calendar';
import calendarIcon from './assets/calendar.png'
import { useParams } from 'react-router-dom';
import Stats from '../components/Stats';
import statsIcon from './assets/statsIcon.png'
import { Link } from 'react-router-dom';


function App() {

  const [isClicked,setIsClicked]=useState(false);
  const [cards,setCards]=useState([]);
  const [debitData,setDebitData]=useState([]);
  const [creditData,setCreditData]=useState([]);
  const [net,setNet]=useState([]);
  const [transactions,setTransactions]=useState([]);
  const [date,setDate]=useState(today);
  const [pickDate,setPickDate]=useState(false);
  const {page}=useParams();

  function formDisplay(){
    setIsClicked((isClicked)=>!isClicked);
  }

  function datePick(){
    setPickDate((pickDate)=>!pickDate);
    
  }
    
  useEffect(()=>{
    fetchDetails(setCreditData,setDebitData,setNet,date);
  },[]);

  useEffect(()=>{
    fetchDetails(setCreditData,setDebitData,setNet,date);
  },[date]);

  useEffect(()=>{
      setTransactions(sortTransactions(creditData,debitData));
  },[creditData,debitData]);


  useEffect(()=>{
    setCards((prev)=>{return transactions.map((ele,index)=>{return <Card key={`${ele.transactionType} ${ele.id}`} product={ele.product} quantity={ele.quantity} amount={ele.amount} idAttribute={ele.id} transactionType={ele.transactionType} setCreditData={setCreditData} setDebitData={setDebitData} setNet={setNet} date={date}/>});}); //setData={setData} setNet={setNet}
  },[transactions]);




  useEffect(()=>{
      updateNet(setNet,date);
  },[cards]);

  return (
    <>
    {page!=='stats'?<div className={style.app}>
      {net.length>0?<p className={net[0].net>0?style.netAmount:style.netAmountLoss}>{net[0].net}</p>:<div className={style.netAmount}><Loader/></div>}
      {date===today?<button type='button' className={style.addBtn} onClick={formDisplay}>+</button>:""}
      <div className={style.calendarIcon}><img src={calendarIcon} alt="calendar" onClick={datePick}/></div>
      <Link to="/stats"><div className={style.statsIcon}><img src={statsIcon} alt="statsIcon" /></div></Link>
      {!pickDate?"":<div className={style.calendar}><Calendar setDate={setDate} setPickDate={setPickDate}/></div>}
      {!isClicked?"":<div className={style.form}><Form cards={cards} setCards={setCards} setIsClicked={setIsClicked} setNet={setNet} setCreditData={setCreditData} setDebitData={setDebitData} date={date}/></div>}
      <div className={style.cards}>{cards}</div>
    </div>:page=='stats'&&<Stats />}
    </>
  )
}

export default App
