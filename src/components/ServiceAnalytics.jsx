// src/components/ServiceAnalytics.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "./analytics.css";

Chart.register(ArcElement, Tooltip, Legend);

const db = getFirestore();

const ServiceAnalytics = () => {
  const [serviceCounts, setServiceCounts] = useState({});
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      const snapshot = await getDocs(collection(db, "bookings"));
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const service = doc.data().serviceType || "other";
        counts[service] = (counts[service] || 0) + 1;
      });
      setServiceCounts(counts);
    };

    fetchBookings();
  }, []);

  const chartData = {
    labels: Object.keys(serviceCounts),
    datasets: [
      {
        data: Object.values(serviceCounts),
        backgroundColor: [
          "#4caf50",
          "#2196f3",
          "#ff9800",
          "#9c27b0",
          "#f44336",
        ],
        borderColor: "#1c1505",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#000000", // black label text
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  };
  

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
      {Object.keys(serviceCounts).length === 0 ? (
        <p className="text-center text-sm text-gray-500">No data available.</p>
      ) : (
        <div className="w-60 mx-auto">
          <Doughnut data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
  
};

export default ServiceAnalytics;
