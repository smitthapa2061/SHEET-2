import React, { useState, useEffect } from "react";
import Dead from "../LiveStats/assets/deaed_logo.png";

import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";

const LiveStats = () => {
  const [matchData, setMatchData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#b31616"); // Default red color

  const url =
    "https://script.google.com/macros/s/AKfycbwwGSnNqWr2FZpEs8l6EAkCjb9miZAJ-X8PyFMcS8kvE3kQ-h_XZk5wQT8-p07-tyF5hA/exec";

  const sheetApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`;

  useEffect(() => {
    // Fetch primary color from Google Sheets
    const fetchColor = async () => {
      try {
        const response = await fetch(sheetApiUrl);
        const data = await response.json();
        const primaryColorRow = data.values.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]); // Set the primary color from the sheet
        }
      } catch (err) {
        console.error("Error fetching primary color:", err);
      }
    };

    fetchColor();

    // Fetch match data
    const fetchData = () => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch data from the server");
          }
          return response.json();
        })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            const uniqueData = data.match_info.reduce((acc, team) => {
              if (
                typeof team.team_name === "string" &&
                team.team_name.trim() !== ""
              ) {
                if (!acc.some((item) => item.team_name === team.team_name)) {
                  acc.push(team);
                }
              }
              return acc;
            }, []);

            uniqueData.sort((a, b) => b.team_kills - a.team_kills);

            setMatchData(uniqueData);

            console.log("Fetched and filtered data:", uniqueData);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError("Error fetching data.");
          setLoading(false);
          console.error("Error fetching data:", err);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, []);

  const validTeams = matchData.filter(
    (team) => typeof team.team_name === "string" && team.team_name.trim() !== ""
  );

  const sortedData = validTeams.sort((a, b) => {
    if (a.Alive === 0 && b.Alive !== 0) return 1;
    if (a.Alive !== 0 && b.Alive === 0) return -1;
    return 0;
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (sortedData.length === 0) {
    return <p>No match data available.</p>;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 1920 }} // Start off-screen (right side)
        animate={{ opacity: 1, x: 0 }} // Fade in and move to its position
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative left-[1559px] top-[20px]">
          <div
            className="bg-[#b31616] w-[360px] h-[36px] flex justify-around text-white text-[22px] items-center font-[poppins]"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="relative left-[30px]">TEAM</div>
            <div className="relative left-[80px]">ALIVE</div>
            <div className="relative left-[23px]">KILLS</div>
          </div>

          <div>
            {sortedData.map((team, index) => (
              <div
                key={index}
                className="bg-[#01010199] w-[360px] h-[50px] flex font-bebas-neue font-[300] border-solid border-[#c1c1c1] border-b-[1px]"
              >
                <div
                  className={`text-white text-[43px] flex text-center justify-center items-center w-[60px] mt-[-5px] ${
                    team.Alive === 0 ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {index + 1}
                </div>

                <div
                  className={`${
                    team.Alive === 0 ? "bg-[#ffffff87]" : "bg-[#ffffff]"
                  } w-[170px] h-[50px] absolute left-[60px] flex justify-left text-black border-solid border-[#b51f1f] border-b-[1px]`}
                  style={{ borderColor: primaryColor }}
                >
                  <div className="w-[50px] h-[50px] absolute z-10">
                    <img
                      src={
                        team.team_logo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="bg-black w-[2px] h-[46px] absolute left-[50px] top-[3px]"></div>
                  <div
                    className="text-[45px] l mt-[-6px] absolute left-[54px]"
                    style={{ opacity: team.Alive === 0 ? 0.5 : 1 }}
                  >
                    {team.team_name}
                  </div>
                </div>

                <div className="absolute left-[240px] flex gap-[3px] mt-[4px]">
                  {team.Alive === 0 ? (
                    <div className="w-[50px] h-[50px] absolute top-[-5px] opacity-[70%]">
                      <img src={Dead} alt="" />
                    </div>
                  ) : (
                    Array.from({ length: Math.min(team.Alive, 4) }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="w-[10px] h-[40px] bg-red-800"
                          style={{ backgroundColor: primaryColor }}
                        ></div>
                      )
                    )
                  )}
                </div>

                <div
                  className="absolute left-[300px] text-white text-[45px] mt-[1px] flex items-center justify-center w-[50px] h-[50px]"
                  style={{ opacity: team.Alive === 0 ? 0.5 : 1 }}
                >
                  {team.team_kills}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveStats;
