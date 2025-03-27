// src/components/ServiceAnalytics.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

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

  return (
    <div className="bg-[#1c1505] border border-[#241901] p-6 rounded-lg shadow-md text-white w-full max-w-md">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">📊 Service Analytics</h2>
        <button
          onClick={() => setShowChart(!showChart)}
          className="bg-[#241901] text-white px-3 py-1 text-sm rounded hover:bg-[#3a2e1a] transition"
        >
          {showChart ? "Hide Chart" : "Show Chart"}
        </button>
      </div>

      {/* Conditionally Render Chart */}
      {showChart && (
        <div className="transition-all duration-500 ease-in-out mt-4">
          {Object.keys(serviceCounts).length === 0 ? (
            <p className="text-center text-sm text-gray-400">No data available.</p>
          ) : (
            <div className="w-60 mx-auto">
              <Doughnut data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceAnalytics;
