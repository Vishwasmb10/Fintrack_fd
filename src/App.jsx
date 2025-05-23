import { useEffect, useState, useContext } from 'react';
import style from '../stylesheets/App.module.css';
import Form from '../components/Form';
import Card from '../components/Card';
import Loader from '../components/Loader';
import sortTransactions from '../jsFiles/sortTransactions';
import { fetchDetails, updateNet, today } from '../jsFiles/dataFetchFunctions';
import Calendar from '../components/Calendar';
import logoutIconDark from "./assets/logoutdark.png";
import logoutIconLight from "./assets/logoutlight.png";
import ThemeToggle from '../components/ThemeToggle';
import calendarIcon from './assets/calendar.png';
import { useNavigate, useParams } from 'react-router-dom';
import Stats from '../components/Stats';
import { ThemeContext } from './ThemeContext';
import Charts from '../components/Charts';

function App() {
  const [date, setDate] = useState(today);
  const [creditData, setCreditData] = useState([]);
  const [debitData, setDebitData] = useState([]);
  const [net, setNet] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cards, setCards] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [pickDate, setPickDate] = useState(false);
  const { page } = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate=useNavigate();

  function formDisplay() {
    setIsClicked((isClicked) => !isClicked);
    console.log(date);
  }

  function datePick() {
    setPickDate((pickDate) => !pickDate);
  }

  function handleLogout(){
    localStorage.removeItem("isAuth");
    // supabase.auth.signOut();
    navigate('/login', { replace: true });

  }
    
  useEffect(() => {
    fetchDetails(setCreditData, setDebitData, setNet, date);
  }, []);

  useEffect(() => {
    fetchDetails(setCreditData, setDebitData, setNet, date);
  }, [date]);

  useEffect(() => {
    setTransactions(sortTransactions(creditData, debitData));
  }, [creditData, debitData]);

  useEffect(() => {
    setCards((prev) => {
      return transactions.map((ele, index) => {
        return (
          <Card 
            key={`${ele.transactionType} ${ele.id}`} 
            product={ele.product} 
            quantity={ele.quantity} 
            amount={ele.amount} 
            idAttribute={ele.id} 
            transactionType={ele.transactionType} 
            setCreditData={setCreditData} 
            setDebitData={setDebitData} 
            setNet={setNet} 
            date={date}
          />
        );
      });
    });
  }, [transactions]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <ThemeToggle />
      {page !== 'stats' ? (
        <>
          <ThemeToggle />
          <div className={style.header}>
            <h1 className={style.appTitle}>FinTrack</h1>
            {net.length > 0 ? (
              <p className={net[0].net > 0 ? style.netAmount : style.netAmountLoss}>
                Balance: {net[0].net}
              </p>
            ) : (
              <div className={style.netAmount}><Loader /></div>
            )}
          </div>
          
          <div className={style.actionButtons}>
              <button type='button' className={style.addBtn} onClick={formDisplay}>
                +
              </button>
            <button className={style.iconBtn} onClick={datePick}>
              <img src={calendarIcon} alt="calendar" />
            </button>
            <Link to="/stats">
              <button className={style.iconBtn}>
                <img src={statsIcon} alt="statsIcon" />
              </button>
            </Link>
              <button type="button" className={style.logoutBtn} onClick={handleLogout}>
                <img src={isDarkMode?logoutIconDark:logoutIconLight} alt="logout" />
              </button>
          </div>
          
          {pickDate && (
            <div className={style.calendar}>
              <Calendar setDate={setDate} setPickDate={setPickDate} />
            </div>
          )}
          
          {isClicked && (
            <div className={style.formOverlay}>
              <Form 
                cards={cards} 
                setCards={setCards} 
                setIsClicked={setIsClicked} 
                setNet={setNet} 
                setCreditData={setCreditData} 
                setDebitData={setDebitData} 
                date={date}
              />
            </div>
          )}
          
          <div className={style.cardsContainer}>
            <h2 className={style.sectionTitle}>Transactions for {date}</h2>
            <div className={style.cards}>{cards}</div>
          </div>

          <Charts creditData={creditData} debitData={debitData} />
        </>
      ) : (
        <Stats />
      )}
    </div>
  );
}

export default App;