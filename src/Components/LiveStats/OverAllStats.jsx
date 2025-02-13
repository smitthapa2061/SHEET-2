import React, { useState, useEffect } from "react";
import axios from "axios";

import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const range = "overall1!A2:G25"; // Range for overall stats
const setupRange = "setup!A2:B10"; // Range for setup data (like primary color)

const OverallStats = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#b31616"); // Default red color

  useEffect(() => {
    let intervalId;

    const fetchData = async () => {
      try {
        // Fetch overall data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}&t=${Date.now()}`; // Add a timestamp to avoid caching
        const response = await axios.get(url);
        const values = response.data.values;

        const formattedData = values.map((row) => ({
          ColumnA: row[0] || "", // Column A
          ColumnB: row[1] || "", // Column B (team logo)
          ColumnC: row[2] || "", // Column C (total kills)
          ColumnD: row[3] || "", // Column D
          ColumnE: row[4] || "", // Column E
          ColumnF: row[5] || "", // Column F
          ColumnG: row[6] || "", // Column G
        }));

        // Filter out duplicates and teams with an empty team name (ColumnA)
        const uniqueData = formattedData.filter(
          (value, index, self) =>
            index ===
              self.findIndex(
                (t) =>
                  t.ColumnA === value.ColumnA &&
                  t.ColumnB === value.ColumnB &&
                  t.ColumnC === value.ColumnC &&
                  t.ColumnD === value.ColumnD &&
                  t.ColumnE === value.ColumnE &&
                  t.ColumnF === value.ColumnF &&
                  t.ColumnG === value.ColumnG
              ) && value.ColumnA.trim() !== "" // Exclude teams with empty team name
        );

        setData(uniqueData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchSetupData = async () => {
      try {
        // Fetch setup data
        const setupUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${setupRange}?key=${apiKey}&t=${Date.now()}`;
        const setupResponse = await axios.get(setupUrl);
        const setupValues = setupResponse.data.values;

        const primaryColorRow = setupValues.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]); // Set primary color
        }
      } catch (err) {
        console.error("Error fetching setup data:", err);
      }
    };

    // Fetch setup data and stats data
    fetchSetupData();
    fetchData();

    // Fetch data every 5 seconds
    intervalId = setInterval(fetchData, 60000);

    // Cleanup the interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const sortedData = [...data].sort((a, b) => {
    const valueA = parseFloat(a.ColumnC) || 0; // Ensure it's a number, default to 0 if not a valid number
    const valueB = parseFloat(b.ColumnC) || 0; // Same for b

    return valueB - valueA; // Sort in descending order
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 1920 }} // Start off-screen (right side)
        animate={{ opacity: 1, x: 0 }} // Fade in and move to its position
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="">
          <div className="relative left-[1547px] top-[20px] ">
            {/* Header */}
            <div
              className="bg-[#b31616] w-[370px] h-[36px] flex justify-around text-white text-[22px] items-center font-[poppins]"
              style={{
                backgroundColor: primaryColor,
              }}
            >
              <div className="relative left-[30px]">TEAM</div>
              <div className="relative left-[80px]">KILLS</div>
              <div className="relative left-[27px]">TOTAL</div>
            </div>

            <div>
              {sortedData.map((row, index) => (
                <div
                  key={index}
                  className="bg-[#01010199] w-[370px] h-[50px] flex font-bebas-neue font-[300] border-solid border-[#c1c1c1] border-b-[1px]"
                >
                  <div className="text-white text-[43px] flex text-center justify-center items-center w-[60px] mt-[-5px]">
                    {index + 1}
                  </div>

                  <div
                    className="bg-[#ffffff] w-[170px] h-[50px] absolute left-[60px] flex justify-left text-black border-solid border-[#b51f1f] border-b-[1px]"
                    style={{
                      borderColor: primaryColor,
                    }}
                  >
                    <div className="w-[50px] h-[50px] absolute z-10">
                      <img
                        src={
                          row.ColumnB ||
                          "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="bg-black w-[2px] h-[46px] absolute left-[50px] top-[3px]"></div>
                    <div className="text-[45px] mt-[-6px] absolute left-[54px]">
                      {row.ColumnA}
                    </div>
                  </div>

                  <div className="absolute left-[245px] text-white text-[45px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]">
                    {row.ColumnD}
                  </div>

                  <div className="absolute left-[310px] text-white text-[45px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]">
                    {row.ColumnC}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OverallStats;
