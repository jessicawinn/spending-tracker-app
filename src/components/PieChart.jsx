// src/components/PieChart.jsx
import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ selectedMonth }) => {
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

    const spendingByCategory = {};
    filtered.forEach((item) => {
      const category = item.category || "Uncategorized";
      spendingByCategory[category] = (spendingByCategory[category] || 0) + Number(item.amount);
    });

    const labels = Object.keys(spendingByCategory);
    const data = labels.map((cat) => spendingByCategory[cat]);

    setChartData({
      labels,
      datasets: [
        {
          label: "Spending by Category",
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
            "#B4E197",
            "#A6A9B6",
            "#E78895",
          ],
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    });
  }, [selectedMonth]);

  const getMonthName = (value) => {
    if (!value) return "All Time";
    return new Date(`${value}-01`).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  };

  if (!chartData || chartData.labels.length === 0) {
    return (
      <div className="text-center mt-8 text-gray-500">
        No category data available for {getMonthName(selectedMonth)}.
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Spending by Category ({getMonthName(selectedMonth)})
      </h2>
      <Pie
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 20,
                boxWidth: 20,
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  const value = tooltipItem.raw;
                  return ` ${tooltipItem.label}: $${value}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default PieChart;
