import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Heading from "./Heading";

// Register the necessary components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const BarChart = ({ month, months }) => {
  const [barData, setBarData] = useState({
    labels: [],
    datasets: [],
  });
  const monthName = months.find((item) => item.id === Number(month))?.name;

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  async function fetchBarChartData() {
    try {
      const response = await axios.get(
        `http://localhost:8800/stat/bar-chart?month=${month}`,
      );

      // Assuming the response has a structure like this:
      // { ranges: ['0-100', '101-200', ...], counts: [10, 5, ...] }
      const ranges = response.data;
      const labels = [
        "1-100",
        "101-200",
        "201-300",
        "301-400",
        "401-500",
        "501-600",
        "601-700",
        "701-800",
        "801-900",
        "901-above",
      ];
      const counts = labels.map((item) => {
        const value = ranges.find((range) => range.priceRange === item);
        return value ? value.count : 0;
      });
      console.log(counts);

      setBarData({
        labels: labels,
        datasets: [
          {
            label: "Number of Items",
            data: counts,
            borderWidth: 1,
            backgroundColor: "#4B70F5",
            borderColor: "#000",
          },
        ],
      });

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      style={{ width: "80%", height: "600px", margin: "0 auto" }}
      className='mt-10 h-full'
    >
      <Heading>Bar Chart Stat- {monthName}</Heading>
      <Bar
        data={barData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              suggestedMax: 5,
              ticks: {
                stepSize: 1, // Set the step size for y-axis labels
                callback: function (value) {
                  return value + " items"; // Customize the y-axis labels here
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BarChart;
