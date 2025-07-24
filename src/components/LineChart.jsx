// src/components/LineChart.jsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const LineChart = ({ selectedMonth }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("spendingRecords")) || [];

    const filtered = storedData.filter((item) => {
      const itemDate = new Date(item.date);
      if (!selectedMonth) return true;
      const [year, month] = selectedMonth.split("-");
      return (
        itemDate.getFullYear() === parseInt(year, 10) &&
        itemDate.getMonth() + 1 === parseInt(month, 10)
      );
    });

    const spendingPerDate = {};
    filtered.forEach((item) => {
      const dateKey = new Date(item.date).toLocaleDateString("en-CA"); // YYYY-MM-DD
      spendingPerDate[dateKey] = (spendingPerDate[dateKey] || 0) + Number(item.amount);
    });

    const labels = Object.keys(spendingPerDate).sort();
    const data = labels.map((date) => spendingPerDate[date]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Daily Spending",
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgb(75, 192, 192)",
          tension: 0.2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    });
  }, [selectedMonth]);

  const getMonthName = (value) => {
    if (!value) return "All Time";
    const [year, month] = value.split("-");
    return new Date(`${value}-01`).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  if (!chartData || chartData.labels.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No spending data available for {getMonthName(selectedMonth)}.
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Spending Trend ({getMonthName(selectedMonth)})
      </h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            x: {
              ticks: { autoSkip: true, maxTicksLimit: 10 },
              title: { display: true, text: "Date" },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: "Amount ($)" },
            },
          },
        }}
      />
    </div>
  );
};

export default LineChart;
