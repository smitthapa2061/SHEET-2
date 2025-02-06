import React, { useState, useEffect } from "react";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";
const range = "SlotList!A1:C21";
const range2 = "setup!A2:B10";

const Map = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch SlotList data
        const response1 = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`
        );
        if (!response1.ok) throw new Error("Failed to fetch SlotList data");
        const result1 = await response1.json();
        const values1 = result1.values || [];

        // Format SlotList data
        const formattedData1 = values1.map((row) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
          ColumnC: row[2] || "",
        }));

        setData(formattedData1);

        // Fetch setup data
        const response2 = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`
        );
        if (!response2.ok) throw new Error("Failed to fetch setup data");
        const result2 = await response2.json();
        const values2 = result2.values || [];

        // Convert setup sheet data to an object for easier access
        const setupData = Object.fromEntries(
          values2.map((row) => [row[0], row[1]])
        );

        setData2(setupData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>Loading...</div>;

  // Split data into two halves for left & right containers
  const firstHalf = data.slice(0, 7);
  const secondHalf = data.slice(7, 14);

  return (
    <div className="w-[1920px] h-[1080px] flex justify-center items-center">
      {/* Left side container */}
      <div className="flex flex-col gap-3 items-center relative left-[-520px]">
        {firstHalf.map((row, index) =>
          row.ColumnB ? (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 w-[480px] h-[140px] relative mb-[0px]"
              style={{ backgroundColor: data2["PRIMARY COLOR"] || "blue" }} // Background color
            >
              <div className="w-[230px] h-[120px] flex justify-center absolute top-[2px] left-[0px]">
                <img
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                  }
                  alt=""
                  className="w-[170px] h-[160px]"
                />
              </div>
              <div
                className="w-[250px] h-[90px] bg-white flex justify-center items-center font-[300] text-[80px] font-bebas-neue relative top-[20px] left-[230px]"
                style={{ color: data2["TEXT COLOR 1"] || "black" }} // Text color
              >
                <div className="relative top-[2px]">{row.ColumnB}</div>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* Spacer */}
      <div className="w-[50px]" />

      {/* Right side container */}
      <div className="flex flex-col gap-3 items-center relative left-[500px]">
        {secondHalf.map((row, index) =>
          row.ColumnB ? (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 w-[450px] h-[140px] relative mb-[0]"
              style={{ backgroundColor: data2["PRIMARY COLOR"] || "red" }} // Background color
            >
              <div className="w-[230px] h-[120px] flex justify-center absolute top-[2px] left-[0px]">
                <img
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                  }
                  alt=""
                  className="w-[170px] h-[160px]"
                />
              </div>
              <div
                className="w-[250px] h-[90px] bg-white flex justify-center items-center font-[300] text-[80px] font-bebas-neue relative top-[20px] left-[220px]"
                style={{ color: data2["TEXT COLOR 1"] || "black" }} // Text color
              >
                <div className="relative top-[2px] left-[-30px]">
                  {row.ColumnB}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      <div className="w-[1080px] h-[1080px] border-white border-[10px] absolute left-[430px] top-[-0px]"></div>
    </div>
  );
};

export default Map;
