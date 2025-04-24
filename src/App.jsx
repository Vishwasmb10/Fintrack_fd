import { useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import Stats from '../components/Stats';
import { today } from '../jsFiles/dataFetchFunctions';
import ThemeToggle from '../components/ThemeToggle';
import { ThemeContext } from './ThemeContext';

function App() {
  const [date, setDate] = useState(today);
  const { page } = useParams();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <ThemeToggle />
      {page !== 'stats' ? (
        <Dashboard date={date} setDate={setDate} />
      ) : (
        <Stats />
      )}
    </div>
  );
}

export default App;