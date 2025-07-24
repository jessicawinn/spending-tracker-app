// src/components/ChartFilter.jsx
import React, { useEffect, useState } from "react";

const ChartFilter = ({ selectedMonth, setSelectedMonth, label }) => {
  const [monthOptions, setMonthOptions] = useState([]);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem("spendingRecords")) || [];
    const monthSet = new Set();

    records.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthSet.add(key);
    });

    const sortedMonths = Array.from(monthSet).sort((a, b) => new Date(b) - new Date(a));
    setMonthOptions(sortedMonths);
  }, []);

  return (
    <div className="text-center mb-6">
      <label className="mr-2 font-medium">{label || "View Data"}:</label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="">All Time</option>
        {monthOptions.map((month) => (
          <option key={month} value={month}>
            {new Date(month + "-01").toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </option>
        ))}
      </select>
    </div>
  );
};


export default ChartFilter;
