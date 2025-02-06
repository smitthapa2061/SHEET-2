import React, { useState, useEffect } from "react";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const range = "SlotList!A1:C21"; // Range you want to fetch (adjust this as needed)
const range2 = "setup!A2:B10";

const SlotListData = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from Google Sheets API
    const fetchData = async () => {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch data from Google Sheets API");
        }

        const result = await response.json();
        const values = result.values;

        // Prepare the data in the format you want
        const formattedData = values.map((row) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
          ColumnC: row[2] || "",
        }));

        setData(formattedData); // Set the fetched data
        try {
          const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;

          const response2 = await fetch(url);

          if (!response2.ok) {
            throw new Error("Failed to fetch data from Google Sheets API");
          }

          const result2 = await response2.json();
          const values2 = result2.values;

          // Prepare the data in the format you want
          const formattedData2 = values2.map((row) => ({
            ColumnB: row[1] || "",
          }));

          setData2(formattedData2); // Set the fetched data
        } catch (err) {
          setError(err.message);
        }
      } catch (err) {
        setError(err.message); // Set error message if any
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  console.log(data2, "data2");

  return (
    <div className="w-[1920px] h-[1080px] ">
      <div className="text-white text-[140px] font-bebas-neue  w-[780px] h-[170px] border-[1px] border-transparent rounded-[10px] flex justify-center relative left-[550px] top-[10px] mb-[70px]">
        <div className="relative top-[-10px]">PLAYING TEAMS</div>
      </div>
      {data2.length > 0 && (
        <div
          style={{
            backgroundColor: `${data2[5].ColumnB}`,
          }}
          className="w-[900px] h-[70px] bg-[white] mb-[-70px] relative left-[475px] text-[60px] text-white font-[orbitron] font-[800]  text-center tracking-wider top-[-70px]"
        >
          <div className="relative top-[-9px]">{data2[0].ColumnB}</div>
        </div>
      )}
      {/*
      {data2.length > 0 && (
        <div>
          {data2[0].ColumnA}.{data2[0].ColumnB}
        </div>
      )}
*/}
      <div className="grid grid-cols-7  p-0 ">
        {data2.length > 0 &&
          data.map((row, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-0 border rounded-lg bg-white w-[230px] h-[170px] mt-[70px] relative top-[-15px] left-[34px]"
            >
              <div className="bg-[#ffffff] w-[230px] h-[400px] border rounded-lg flex justify-center relative top-[2px]">
                <img
                  src={
                    row.ColumnC ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                  }
                  alt=""
                  className="w-[170px] h-[160px]  relative top-[-10px]"
                />
              </div>
              <div
                style={{
                  backgroundColor: `${data2[5].ColumnB}`,
                }}
                className="w-[200px] h-[60px] bg-red-900  flex justify-center items-center font-[300]] text-white  border rounded-lg text-[40px]  font-bebas-neue relative top-[-40px] left-[-20px]"
              >
                <div className="relative top-[2px]">
                  {row.ColumnA}.{row.ColumnB}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SlotListData;
