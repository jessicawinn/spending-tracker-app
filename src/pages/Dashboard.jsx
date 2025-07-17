import React, { useState } from 'react';

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('2025-07');
  const [allTimeTotal] = useState(12345.67);
  const [periodTotal] = useState(789.01);
  const [categories, setCategories] = useState(['Food', 'Transport', 'Utilities']);
  const [records] = useState([{ amount: 50 }, { amount: 30 }, { amount: 100 }]);

  const handleAddCategory = () => {
    const newCategory = prompt('Enter new category name:');
    if (newCategory) {
      setCategories([...categories, newCategory]);
    }
  };

  return (
    <div className="p-6 font-sans space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-gray-600">Track and analyze your spending patterns</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="border px-4 py-2 rounded-md"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {timePeriod === 'monthly' && (
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border px-4 py-2 rounded-md"
          />
        )}

        <button
          onClick={handleAddCategory}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500">All Time Total</p>
          <p className="text-xl font-semibold">${allTimeTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500 capitalize">{timePeriod} Total</p>
          <p className="text-xl font-semibold">${periodTotal.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500">Categories</p>
          <p className="text-xl font-semibold">{categories.length}</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <p className="text-gray-500">Total Records</p>
          <p className="text-xl font-semibold">{records.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-medium text-lg">Spending Trend</h3>
          <p className="text-gray-500 text-sm mb-2">
            {timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)} spending over time
          </p>
          <div className="h-40 flex items-center justify-center text-gray-400 italic">
            [Chart placeholder]
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-medium text-lg">Spending by Category</h3>
          <p className="text-gray-500 text-sm mb-2">
            Breakdown of {timePeriod} spending by category
          </p>
          <div className="h-40 flex items-center justify-center text-gray-400 italic">
            [Pie chart placeholder]
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-medium text-lg">All Time Trend</h3>
          <p className="text-gray-500 text-sm mb-2">Complete spending history</p>
          <div className="h-40 flex items-center justify-center text-gray-400 italic">
            [Chart placeholder]
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border">
          <h3 className="font-medium text-lg">All Time Categories</h3>
          <p className="text-gray-500 text-sm mb-2">Complete category breakdown</p>
          <div className="h-40 flex items-center justify-center text-gray-400 italic">
            [Pie chart placeholder]
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
