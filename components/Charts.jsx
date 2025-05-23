import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useState } from 'react';
import style from '../stylesheets/Charts.module.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Charts({ creditData, debitData }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'credit', 'debit'

  // Detect theme
  const isDark = typeof window !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark';

  // Process data for charts
  const processData = () => {
    const dates = [...new Set([...creditData.map(item => item.date), ...debitData.map(item => item.date)])].sort();
    
    const creditAmounts = dates.map(date => {
      const dayData = creditData.filter(item => item.date === date);
      return dayData.reduce((sum, item) => sum + Number(item.amount), 0);
    });

    const debitAmounts = dates.map(date => {
      const dayData = debitData.filter(item => item.date === date);
      return dayData.reduce((sum, item) => sum + Number(item.amount), 0);
    });

    const totalAmounts = dates.map((_, index) => creditAmounts[index] - debitAmounts[index]);

    return { dates, creditAmounts, debitAmounts, totalAmounts };
  };

  const { dates, creditAmounts, debitAmounts, totalAmounts } = processData();

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: 'Credit',
        data: creditAmounts,
        borderColor: isDark ? '#ffffff' : 'var(--success-color)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(34, 197, 94, 0.05)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#22c55e',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: 'Debit',
        data: debitAmounts,
        borderColor: isDark ? '#ffffff' : 'var(--error-color)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(239, 68, 68, 0.05)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#ef4444',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
      },
      {
        label: 'Total',
        data: totalAmounts,
        borderColor: isDark ? '#ffffff' : 'var(--accent-color)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(139, 92, 246, 0.05)',
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        spanGaps: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '600',
          },
          color: 'var(--text-primary)',
        },
      },
      title: {
        display: true,
        text: 'Financial Overview',
        font: {
          size: 18,
          weight: '600',
        },
        color: 'var(--text-primary)',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'var(--bg-secondary)',
        titleColor: 'var(--text-primary)',
        bodyColor: 'var(--text-primary)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600',
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'var(--border-color)',
        borderWidth: 1,
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'var(--chart-grid)',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'var(--chart-text)',
          callback: function(value) {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            }).format(value);
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'var(--chart-text)',
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  };

  const filteredData = {
    ...chartData,
    datasets: chartData.datasets.filter(dataset => {
      if (activeTab === 'all') return true;
      return dataset.label.toLowerCase() === activeTab;
    }),
  };

  return (
    <div className={style.chartsContainer}>
      <div className={style.tabs}>
        <button
          className={`${style.tab} ${activeTab === 'all' ? style.activeAll : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`${style.tab} ${activeTab === 'credit' ? style.activeCredit : ''}`}
          onClick={() => setActiveTab('credit')}
        >
          Credit
        </button>
        <button
          className={`${style.tab} ${activeTab === 'debit' ? style.activeDebit : ''}`}
          onClick={() => setActiveTab('debit')}
        >
          Debit
        </button>
      </div>
      <div className={style.chartWrapper}>
        <Line data={filteredData} options={options} />
      </div>
    </div>
  );
} 