import React, { useState, useEffect } from "react";
import axios from "axios";

import LiveStats from "../LiveStats/page";
import OverAllStats from "../LiveStats/OverAllStats";

function Controller() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
  const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
  const range = "display!A21:B37"; // Range you want to fetch

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        console.log("Fetching data...");
        const response = await axios.get(`${url}&t=${new Date().getTime()}`); // Add timestamp to bypass cache

        // Handle the fetched data
        const values = response.data.values || [];
        const formattedData = values.map((row) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1]?.toUpperCase() || "",
        }));

        console.log("Fetched Data:", formattedData); // Log fetched data
        setData(formattedData);
        setError(null); // Reset error state on successful fetch
        setLoading(false);
      } catch (err) {
        // Handle errors precisely
        const errorMessage = `Error fetching data: ${
          err.response?.data?.error?.message || err.message
        }`;
        console.error(errorMessage); // Log precise error
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 20000); // Fetch every 20 seconds

    // Cleanup on component unmount
    return () => {
      clearInterval(interval);
      console.log("Fetching stopped: Component unmounted.");
    };
  }, [apiKey, spreadsheetId, range]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  // Find the first row where ColumnB is "TRUE"
  const firstActiveRow = data.find((item) => item.ColumnB === "TRUE");

  if (!firstActiveRow) return null; // If no active rows found, return null

  // Render the component based on ColumnA of the first active row
  return (
    <div>
      {firstActiveRow.ColumnA === "Live Stats" && <LiveStats />}
      {firstActiveRow.ColumnA === "Overall Stats" && <OverAllStats />}
    </div>
  );
}

export default Controller;
