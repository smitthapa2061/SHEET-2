import axios from "axios";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
const apiKey = "AIzaSyCgDkaR7IVZDB6INAyjHNRcu3brZfoWpSA"; // Your Google Sheets API key
const spreadsheetId = "1u1t50nxdhlZimY3vsOlM6452gBauTZZ0g2UdfRsj7T8"; // Your Google Sheets ID
const range = "matchSchedule!A2:H6"; // Range you want to fetch (adjust this as needed)
const range2 = "setup!A2:B10"; // Range for setup sheet

const Schedule = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [data2, setData2] = useState(null);
  useEffect(() => {
    // Fetch data from Google Sheets API using axios
    const fetchData = async () => {
      try {
        const matchScheduleUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const setupUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;

        const [matchScheduleResponse, setupResponse] = await Promise.all([
          axios.get(matchScheduleUrl),
          axios.get(setupUrl),
        ]);

        // Process match schedule data
        const values = matchScheduleResponse.data.values || [];
        const filteredData = values
          .filter((row) => row[3]?.toLowerCase() === "true") // Filter by status "true"
          .map((row) => ({
            MATCH_NAME: row[0] || "",
            MAP_NAME: row[1] || "",
            IMAGE_LINK: row[2] || "",
            CHECK_BOX: row[3] || "",
            MATCH_NUMBER: row[4] || "",
            MATCH_TIME: row[5] || "",
            WWCD_TEAM: row[6] || "",
            WWCD_TEAM_LOGO: row[7] || "",
          }));

        setData(filteredData);

        // Process setup sheet data
        const setupValues = setupResponse.data.values || [];
        const formattedData2 = setupValues.map((row) => ({
          ColumnA: row[0] || "",
          ColumnB: row[1] || "",
        }));

        setData2(formattedData2);
      } catch (err) {
        setError(err.message); // Set error message if any API call fails
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data || !data2) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center   w-[1920px] h-[1080px] font-bebas-neue">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 2 }}
      >
        {data.length === 0 ? (
          <p className="text-white">No matches are selected</p>
        ) : (
          <div className="w-[1920px] h-[1080px]">
            <div className="text-white text-[160px] font-bebas-neue w-[900px] h-[200px] border-[1px] border-transparent rounded-[10px] flex justify-center relative top-[30px] mx-auto">
              <div className="absolute top-[-10px] w-[900px] left-[83px]">
                MATCH SCHEDULE
              </div>
              <div
                style={{
                  backgroundColor: `${data2?.[5]?.ColumnB || "#fff"}`,
                }}
                className="w-[1000px] absolute h-[60px] mb-[-40px]  left-[0px] text-[40px] text-white font-[orbitron] font-[800] text-center tracking-wider top-[190px]"
              >
                <div>
                  {data2?.[2]?.ColumnB || ""} | DAY -{" "}
                  {data2?.[3]?.ColumnB || ""} | MATCH -{" "}
                  {data2?.[4]?.ColumnB || ""}
                </div>
              </div>
            </div>
            <div className="flex flex-row flex-wrap justify-center gap-6 mt-8">
              {data.map((match, index) => (
                <div key={index}>
                  {/* Match details */}
                  {/* 
                  <p><strong>Match Name:</strong> {match.MATCH_NAME}</p>
                  <p><strong>Map Name:</strong> {match.MAP_NAME}</p>
                  <p><strong>Image Link:</strong> {match.IMAGE_LINK}</p>
                  <p><strong>Check Box:</strong> {match.CHECK_BOX}</p>
                */}

                  {/* Match Card */}
                  <div key={index} className="">
                    <div className="bg-white border-[8px] border-black w-[22rem] h-[43rem] relative top-[80px] left-[0px] flex flex-col">
                      {/* A simple red square (can be used for any visual indicator) */}

                      <div className="bg-[#f5f5f5] w-[100%] h-[139px] relative top-[0px] z-10">
                        <div className="text-[40px] relative left-[220px] top-[15px] scale-150">
                          {match.WWCD_TEAM ? match.WWCD_TEAM : match.MATCH_TIME}
                        </div>
                      </div>
                      <div
                        className="bg-red-600 w-[90px] h-[140px] top-[-85px] relative z-10 flex justify-center"
                        style={{
                          backgroundColor: `${data2?.[5]?.ColumnB || "#fff"}`,
                        }}
                      >
                        <div className="text-[3.6rem] text-white p-0 m-0 scale-150 top-[6px] relative">
                          {match.MATCH_NUMBER}
                        </div>
                      </div>

                      {match.WWCD_TEAM ? (
                        <div
                          className="bg-violet-800 w-[full] h-[850px] relative top-[-87px] z-0"
                          style={{
                            background: `url(${match.IMAGE_LINK}) no-repeat center center`,
                            backgroundSize: "cover",
                          }}
                        >
                          <img
                            src={match.WWCD_TEAM_LOGO}
                            alt=""
                            className="mb-[-315px]"
                          />
                          <div
                            src=""
                            alt=""
                            className=" bg-gradient-to-b from-transparent to-black h-[360px] relative top-[200px]"
                          ></div>
                          <div
                            className="bg-red-800 h-[96px] w-[340px] absolute top-[496px]"
                            style={{
                              backgroundColor: `${
                                data2?.[5]?.ColumnB || "#fff"
                              }`,
                            }}
                          >
                            <div className="text-white text-[80px] relative left-[88px] top-[-5px] font-bebas-neue font-[500] tracking-wide">
                              WWCD
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="bg-violet-800 w-[full] h-[850px] relative top-[-87px] z-0"
                          style={{
                            background: `url(${match.IMAGE_LINK}) no-repeat center center`,
                            backgroundSize: "cover",
                          }}
                        >
                          <div
                            className="bg-red-800 h-[96px] w-[full] relative top-[496px]"
                            style={{
                              backgroundColor: `${
                                data2?.[5]?.ColumnB || "#fff"
                              }`,
                            }}
                          >
                            <div className="text-white text-[80px] relative left-[60px] top-[-5px] font-bebas-neue font-[500] tracking-wide">
                              {match.MAP_NAME}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Schedule;
