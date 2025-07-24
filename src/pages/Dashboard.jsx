import React, { useState, useEffect } from 'react';
import LineChart from '../components/LineChart';
import PieChart from '../components/PieChart';
import ChartFilter from '../components/ChartFilter';

// Helper to get start and end dates of a week from a "YYYY-Www" string
function getWeekRange(weekStr) {
  const [yearStr, weekNumStr] = weekStr.split('-W');
  const year = parseInt(yearStr, 10);
  const weekNum = parseInt(weekNumStr, 10);

  const jan1 = new Date(year, 0, 1);
  const firstThursday = new Date(jan1.getTime());
  firstThursday.setDate(jan1.getDate() + ((4 - jan1.getDay()) + 7) % 7);

  const startOfWeek = new Date(firstThursday);
  startOfWeek.setDate(firstThursday.getDate() + 7 * (weekNum - 1) - 3);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return [startOfWeek, endOfWeek];
}

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [selectedDay, setSelectedDay] = useState(new Date().toISOString().slice(0, 10));
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date();
    const onejan = new Date(now.getFullYear(), 0, 1);
    const weekNum = Math.ceil(((now - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const [allTimeTotal, setAllTimeTotal] = useState(0);
  const [periodTotal, setPeriodTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [groupedByCategory, setGroupedByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [lineChartMonth, setLineChartMonth] = useState("");
  const [pieChartMonth, setPieChartMonth] = useState("");

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("spendingRecords")) || [];
    setRecords(storedRecords);

    // All time total
    const total = storedRecords.reduce((sum, r) => sum + (r.amount || 0), 0);
    setAllTimeTotal(total);

    // Unique categories from all records
    const uniqueCategories = [...new Set(storedRecords.map(r => r.category))];
    setCategories(uniqueCategories);

  }, []);

  useEffect(() => {
    // Filter by time period
    let filtered = [];
    if (timePeriod === 'daily') {
      filtered = records.filter(r => r.date === selectedDay);
    } else if (timePeriod === 'weekly') {
      const [start, end] = getWeekRange(selectedWeek);
      filtered = records.filter(r => {
        if (!r.date) return false;
        const d = new Date(r.date);
        return d >= start && d <= end;
      });
    } else if (timePeriod === 'monthly') {
      filtered = records.filter(r => r.date && r.date.startsWith(selectedMonth));
    }

    // Set categories available for filtered records
    const filteredCats = [...new Set(filtered.map(r => r.category))];
    setFilteredCategories(filteredCats);

    // Filter by category if selected
    let filteredByCategory = filtered;
    if (selectedCategory !== 'all') {
      filteredByCategory = filtered.filter(r => r.category === selectedCategory);
    }

    // Calculate totals
    const periodSum = filteredByCategory.reduce((sum, r) => sum + (r.amount || 0), 0);
    setPeriodTotal(periodSum);

    // Group by category (for showing table)
    const grouped = filtered.reduce((acc, rec) => {
      acc[rec.category] = (acc[rec.category] || 0) + rec.amount;
      return acc;
    }, {});
    setGroupedByCategory(grouped);

  }, [timePeriod, selectedDay, selectedWeek, selectedMonth, selectedCategory, records]);

  return (
    <div className="p-6 font-sans space-y-6 mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Track and analyze your spending patterns</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={timePeriod}
          onChange={(e) => {
            setTimePeriod(e.target.value);
            setSelectedCategory('all'); // reset category on time period change
          }}
          className="border px-4 py-2 rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {timePeriod === 'daily' && (
          <input
            type="date"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        )}
        {timePeriod === 'weekly' && (
          <input
            type="week"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        )}
        {timePeriod === 'monthly' && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        )}

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="all">All Categories</option>
          {filteredCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500">All Time Total</p>
          <p className="text-xl font-semibold">${allTimeTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500 capitalize">{timePeriod} Total</p>
          <p className="text-xl font-semibold">${periodTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500 capitalize">Total Categories</p>
          <p className="text-xl font-semibold">{categories.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500 capitalize">Total Records</p>
          <p className="text-xl font-semibold">{records.length}</p>
        </div>
      </div>

      <div className='flex flex-col md:flex-row gap-6'>
        <div className="bg-white p-4 shadow rounded-lg border w-full">
          <ChartFilter
            selectedMonth={lineChartMonth}
            setSelectedMonth={setLineChartMonth}
            label="Line Chart Data"
          />
          <LineChart selectedMonth={lineChartMonth} />
        </div>
        <div className="bg-white p-4 shadow rounded-lg border w-full">
          <ChartFilter
            selectedMonth={pieChartMonth}
            setSelectedMonth={setPieChartMonth}
            label="Pie Chart Data"
          />
          <PieChart selectedMonth={pieChartMonth} />
        </div>
      </div>




    </div>
  );
}
