import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../src/supabaseClient";
import style from "../stylesheets/Stats.module.css";
import calendarIcon from '../src/assets/calendar.png'
import homeIcon from "../src/assets/home.png"
import StatsTable from "./StatsTable";
import {fetchValuesByMonth} from "../jsFiles/dataFetchFunctions";

function Stats(props){
    const [dataByMonth,setDataByMonth]=useState([]);
    const [month,setMonth]=useState(new Date().getMonth()+1);
    const [pickMonth,setPickMonth]=useState(false);

    const monthList=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const months=monthList.map((ele,index)=>{return <li key={index} value={index<9?`0${index+1}`:index+1} onClick={selectMonth}>{ele}</li>});

    function monthPick(){
      setPickMonth((pickMonth)=>!pickMonth);      
    }

    function selectMonth(e){
      setMonth(e.target.value);
      setPickMonth((pickMonth)=>!pickMonth);      
    }
    
    useEffect(()=>{fetchValuesByMonth(setDataByMonth,month)},[month]);

    return(
        <div className={style.statsContainer}>
            <Link to='/'><img src={homeIcon} alt="homeIcon" className={style.homeIcon}/></Link>
            <p className={style.currentMonth} onClick={monthPick}>Month: {monthList[month-1]}</p>
            {/* <div className={style.calendarIcon}><img src={calendarIcon} alt="calendar" onClick={monthPick}/></div> */}
            <div className={style.statsTableWrapper}>{dataByMonth.length>0?<StatsTable dataByMonth={dataByMonth}/>:<p className={style.noData}>No data Found</p>}</div>
            {pickMonth&&<div className={style.monthsContainer}>
                        <ul>
                        <p>Pick a Month</p>
                        {months}
                        </ul>
              </div>}
        </div>
    );
}

export default Stats;