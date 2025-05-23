import { useState, useContext } from 'react';
import { ThemeContext } from '../src/ThemeContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, parseISO } from 'date-fns';

export default function WeeklyChart({ data }) {
  const [chartType, setChartType] = useState('bar');
  const { isDarkMode } = useContext(ThemeContext);
  
  // Format dates for display
  const formattedData = data.map(item => ({
    ...item,
    formattedDate: format(parseISO(item.date), 'MMM d')
  }));

  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#2d3748' : '#ffffff',
    borderColor: isDarkMode ? '#4a5568' : '#e2e8f0',
    color: isDarkMode ? '#f7fafc' : '#333333',
  };

  return (
    <div className="w-full h-full">
      <div className="flex mb-4 gap-2">
        <button
          onClick={() => setChartType('bar')}
          className={`px-3 py-1.5 text-sm rounded ${
            chartType === 'bar'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Bar Chart
        </button>
        <button
          onClick={() => setChartType('stacked')}
          className={`px-3 py-1.5 text-sm rounded ${
            chartType === 'stacked'
              ? 'bg-primary text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Stacked
        </button>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#4a5568' : '#e2e8f0'} />
          <XAxis 
            dataKey="formattedDate" 
            tick={{ fill: isDarkMode ? '#e2e8f0' : '#333333' }} 
          />
          <YAxis 
            tick={{ fill: isDarkMode ? '#e2e8f0' : '#333333' }} 
          />
          <Tooltip 
            contentStyle={tooltipStyle}
            formatter={(value, name) => [`${value}`, name === 'credit' ? 'Income' : name === 'debit' ? 'Expense' : 'Net']}
            labelFormatter={(value) => `Date: ${value}`}
          />
          <Legend 
            formatter={(value) => value === 'credit' ? 'Income' : value === 'debit' ? 'Expense' : 'Net Balance'}
          />
          
          {chartType === 'bar' ? (
            <>
              <Bar dataKey="credit" fill="#10b981" name="credit" />
              <Bar dataKey="debit" fill="#ef4444" name="debit" />
              <Bar dataKey="net" fill="#3b82f6" name="net" />
            </>
          ) : (
            <>
              <Bar dataKey="credit" stackId="a" fill="#10b981" name="credit" />
              <Bar dataKey="debit" stackId="a" fill="#ef4444" name="debit" />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 