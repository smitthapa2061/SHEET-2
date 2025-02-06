import React, { useState, useEffect } from "react";
import axios from "axios";
import Overall from "../OverallData/Page";
import Fragger from "../Fragger/Page";
import MatchData from "../MatchData/page";
import MatchFragger from "../MatchFragger/page";
import WwcdTeamStats from "../MatchData/WwcdStats";
import Mvp from "../MatchData/Mvp";
import Champions from "../MatchData/Champions";
import FirstRunnerUp from "../MatchData/1stRunnerUp";
import Third from "../MatchData/Third";
import EventMvp from "../MatchData/EventMvp";

function Controller() {
  const [data, setData] = useState([]); // Holds the active data displayed
  const [nextData, setNextData] = useState([]); // Holds the newly fetched data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Tracks the initial load state

  const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
  const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";
  const range = "display!A2:B58";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        console.log("Fetching data...");
        const response = await axios.get(url);
        const values = response.data.values || [];

        const formattedData = values
          .filter((row) => row.length >= 2)
          .map((row) => ({
            ColumnA: row[0] || "",
            ColumnB: row[1] || null,
          }));

        console.log("Formatted Data:", formattedData);
        setNextData(formattedData); // Store fetched data temporarily
        setError(null);
      } catch (err) {
        const errorMessage = `Error fetching data: ${
          err.response?.data?.error?.message || err.message
        }`;
        console.error(errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 8000); // Fetch every 8 seconds

    return () => {
      clearInterval(interval);
      console.log("Fetching stopped: Component unmounted.");
    };
  }, [apiKey, spreadsheetId, range]);

  // Only update `data` when `nextData` is ready
  useEffect(() => {
    if (nextData.length > 0) {
      setData(nextData);
    }
  }, [nextData]);

  // Find the active row with TRUE value
  const activeRow = data.find((item) => item.ColumnB === "TRUE");

  return (
    <div>
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {/* Show the previous valid data until new one is ready */}
      <div>
        {activeRow?.ColumnA === "WwcdTeamStats" && <WwcdTeamStats />}
        {activeRow?.ColumnA === "Mvp" && <Mvp />}
        {activeRow?.ColumnA === "OverallData" && <Overall />}
        {activeRow?.ColumnA === "MatchData" && <MatchData />}
        {activeRow?.ColumnA === "MatchFragger" && <MatchFragger />}
        {activeRow?.ColumnA === "OverallFragger" && <Fragger />}
        {activeRow?.ColumnA === "Champions" && <Champions />}
        {activeRow?.ColumnA === "1stRunnerUp" && <FirstRunnerUp />}
        {activeRow?.ColumnA === "2ndRunnerUp" && <Third />}
        {activeRow?.ColumnA === "EventMvp" && <EventMvp />}
      </div>
    </div>
  );
}

export default Controller;
