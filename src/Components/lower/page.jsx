import React, { useState, useEffect } from "react";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const range = "setup!A2:B10"; // Range you want to fetch (adjust this as needed)

const Lower = () => {
  const [data, setData] = useState(null);
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

        // Map and format data as needed
        const formattedData = {
          TOR_NAME: values[0] ? values[0][1] : "",
          TOR_LOGO: values[1] ? values[1][1] : "",
          ROUND: values[2] ? values[2][1] : "",
          DAY: values[3] ? values[3][1] : "",
          MATCHES: values[4] ? values[4][1] : "",
          PRIMARY_COLOR: values[5] ? values[5][1] : "",
          SECONDARY_COLOR: values[6] ? values[6][1] : "",
          TEXT_COLOR_1: values[7] ? values[7][1] : "",
          TEXT_COLOR_2: values[8] ? values[8][1] : "",
        };

        setData(formattedData); // Set the fetched data
      } catch (err) {
        setError(err.message); // Set error message if any
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" flex items-end ">
      <div className="flex items-center gap-2  w-[1920px] h-[1080px]  absolute left-[3%] top-[390px] ">
        <div
          className="bg-[#cb201e] mt-4  w-[10rem] h-[10rem] rotate-45 flex justify-center items-center shadow-xl"
          style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
        >
          {/**image inside box rectangle */}
          <div
            className="bg-[#8a110f] border-4  border-black w-[8rem] h-[8rem] flex items-center justify-center"
            style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
          >
            <img
              src={data.TOR_LOGO}
              alt=""
              className="transform rotate-[-45deg] w-full h-full p-2"
            />
          </div>
        </div>
        <div className="flex flex-col ">
          <div className="w-[14rem] h-[1rem] transform skew-x-[45deg] bg-white flex items-center ">
            <span className="transform -skew-x-[45deg] text-black font-bebas-neue mx-2">
              <p className="font-[900] font-[orbitron] tracking-widest relative left-[8px]">
                {data.TOR_NAME}
              </p>
            </span>
          </div>

          <div
            className="w-[20rem] h-[4rem] transform skew-x-[45deg] bg-[#cb201e] flex justify-center items-center"
            style={{ backgroundColor: `${data.PRIMARY_COLOR}` }}
          >
            <span className="block transform -skew-x-[45deg] text-white font-[200] text-[3.1rem] font-bebas-neue mx-2 relative top-[2px] ">
              DAY {data.DAY} - MATCH {data.MATCHES}
            </span>
          </div>
          {/**upper rectangle */}
          <div className="flex items-center justify-start mt-2 ">
            {/**Lower rectangle */}
            <div className="bg-white  w-[17rem] h-[4rem] transform  skew-x-[135deg]  shadow-lg flex items-center justify-center">
              <div className="block transform -skew-x-[135deg] text-black font-[500] text-4xl font-bebas-neue mx-2 ">
                {data.ROUND}
              </div>
            </div>
            <div class="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-6 shadow-lg"></div>
            <div class="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-16 shadow-lg"></div>
            <div class="w-[5rem] h-[0.4rem] bg-white transform rotate-[135deg] -ml-16 shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lower;
