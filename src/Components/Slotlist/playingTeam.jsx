import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Slotlist/playing.css";

// Google Sheets API Key and Spreadsheet details
const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const range = "SlotList!A1:E21"; // Include column D in the range

const PlayingTeams = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // Fetch data from Google Sheets API using axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for SlotList range
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get(url);

        if (response.status === 200) {
          const values = response.data.values;

          const formattedData = values.map((row) => ({
            ColumnA: row[0] || "",
            ColumnB: row[1] || "",
            ColumnC: row[2] || "",
            ColumnD: row[3]?.toLowerCase() === "true", // Treat "true" as a ticked checkbox
            ColumnE: row[4] || "green", // Fallback to green if ColumnE is missing
          }));

          setData(formattedData);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[1920px] h-[1080px] ">
      <div className="text-white text-[140px] font-bebas-neue w-[780px] h-[170px] border-[1px] border-transparent rounded-[10px] flex justify-center relative left-[550px] top-[10px] mb-[70px]"></div>
      <div className="grid grid-cols-7 p-0">
        {data
          .filter((row) => row.ColumnD) // Only include rows where ColumnD is true
          .map((row, index) => (
            <div
              key={index}
              className="flex w-[1920px] h-[1080px] mt-[70px] relative top-[-15px] left-[34px]"
            >
              <div className="relative container-1">
                {/* Yellow Box */}
                <div
                  className="w-[110px] h-[35px] absolute top-[-228px] left-[-40px] z-5"
                  // Dynamic background color from ColumnE
                ></div>

                {/* Logo */}
                <div className="container-2 w-[100px] h-[100px] flex justify-center absolute top-[-250px] ml-[-17px] z-3">
                  <img
                    src={row.ColumnC} // Replace with your actual image path
                    alt="Clipped Logo"
                    className="w-[90px] h-[90px] relative right-[10px] top-[-4px] clip-top-bottom"
                    style={{
                      objectFit: "contain", // Ensures the logo fits the clipped box
                    }}
                  />
                </div>
              </div>

              <div className="bg-[#000000b4] w-[69px] h-[65px] flex justify-center absolute top-[583px] left-[730px] z-10">
                <img
                  src={row.ColumnC}
                  alt=""
                  className="w-[64px] h-[64px] relative top-[0px] left-[]"
                />
              </div>

              <div className="flex justify-left items-center font-[300] text-white text-[32px] font-bebas-neue absolute top-[576px] left-[810px] z-10">
                {row.ColumnB}
              </div>
              <div
                style={{ backgroundColor: row.ColumnE }}
                className="w-[100px] h-[31px] flex justify-left items-center font-[300] text-white text-[35px] font-bebas-neue absolute top-[583px] left-[790px] skew-x-12 z-0"
              ></div>
              <div
                style={{ backgroundColor: row.ColumnE }}
                className="w-[68px] h-[65px] flex justify-center absolute top-[583px] left-[730px]"
                // Apply dynamic background color
              ></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlayingTeams;
