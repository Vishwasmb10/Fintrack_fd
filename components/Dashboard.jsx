import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext';
import Card from './Card';
import Form from './Form';
import WeeklyChart from './WeeklyChart';
import Calendar from './Calendar';
import { fetchDetails, updateNet } from '../jsFiles/dataFetchFunctions';
import { supabase } from '../src/supabaseClient';
import sortTransactions from '../jsFiles/sortTransactions';
import calendarIcon from '../src/assets/calendar.png';
import statsIcon from '../src/assets/statsIcon.png';
import { Link } from 'react-router-dom';

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-t-lg transition-all duration-200 ${
      active 
        ? 'bg-white dark:bg-gray-800 text-primary border-b-2 border-primary' 
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {children}
  </button>
);

export default function Dashboard({ date, setDate }) {
  const [activeTab, setActiveTab] = useState('transactions');
  const [isClicked, setIsClicked] = useState(false);
  const [cards, setCards] = useState([]);
  const [debitData, setDebitData] = useState([]);
  const [creditData, setCreditData] = useState([]);
  const [net, setNet] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pickDate, setPickDate] = useState(false);
  const [weeklyData, setWeeklyData] = useState([]);
  const { isDarkMode } = useContext(ThemeContext);

  function formDisplay() {
    setIsClicked((isClicked) => !isClicked);
  }

  function datePick() {
    setPickDate((pickDate) => !pickDate);
  }

  // Get weekly data for the chart
  async function fetchWeeklyData() {
    try {
      // Calculate date range for the past 7 days
      const today = new Date();
      const weekAgo = new Date(today);
      weekAgo.setDate(today.getDate() - 6); // Get 7 days including today
      
      // Format dates for query - needs YYYY-MM-DD format
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      // Get all net values for the date range
      const { data, error } = await supabase
        .from('net')
        .select('*')
        .gte('date', formatDate(weekAgo))
        .lte('date', formatDate(today))
        .order('date', { ascending: true });
      
      if (error) {
        console.error("Error fetching weekly data:", error);
        return;
      }
      
      // Process data for the chart
      const processedData = data.map(item => ({
        date: item.date,
        credit: item.credit || 0,
        debit: item.debit || 0,
        net: item.net || 0
      }));
      
      setWeeklyData(processedData);
    } catch (err) {
      console.error("Error in fetchWeeklyData:", err);
    }
  }

  useEffect(() => {
    fetchDetails(setCreditData, setDebitData, setNet, date);
    fetchWeeklyData();
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
    <div className={`w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header with balance */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">FinTrack</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <button onClick={datePick} className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md mr-2">
                <img src={calendarIcon} alt="calendar" className="w-5 h-5" />
              </button>
              <Link to="/stats">
                <button className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md">
                  <img src={statsIcon} alt="statsIcon" className="w-5 h-5" />
                </button>
              </Link>
            </div>
            {net.length > 0 ? (
              <div className={`py-2 px-4 rounded-lg font-semibold ${
                net[0].net > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                Balance: {net[0].net}
              </div>
            ) : (
              <div className="py-2 px-4 rounded-lg bg-gray-200 dark:bg-gray-700">
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <TabButton 
              active={activeTab === 'transactions'} 
              onClick={() => setActiveTab('transactions')}
            >
              Transactions
            </TabButton>
            <TabButton 
              active={activeTab === 'insights'} 
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </TabButton>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'transactions' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  Transactions for {date}
                </h2>
                <button 
                  onClick={formDisplay}
                  className="py-2 px-4 bg-primary text-white rounded-lg shadow hover:bg-indigo-600 transition-colors"
                >
                  Add Transaction
                </button>
              </div>
              
              {cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards}
                </div>
              ) : (
                <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <p className="text-gray-500 dark:text-gray-400">No transactions for this date</p>
                  <button 
                    onClick={formDisplay}
                    className="mt-4 py-2 px-4 bg-primary text-white rounded-lg shadow hover:bg-indigo-600 transition-colors"
                  >
                    Add Your First Transaction
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Weekly Overview
                </h2>
                <div className="h-80">
                  <WeeklyChart data={weeklyData} />
                </div>
              </div>
              
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Current Month Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-300">Total Income</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-200">
                      {creditData.reduce((sum, item) => sum + Number(item.amount), 0)}
                    </p>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-300">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-200">
                      {debitData.reduce((sum, item) => sum + Number(item.amount), 0)}
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-300">Net Balance</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                      {net.length > 0 ? net[0].net : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {pickDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <Calendar setDate={setDate} setPickDate={setPickDate} />
        </div>
      )}

      {isClicked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
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
    </div>
  );
} 