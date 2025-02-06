import React, { useState, useEffect } from "react";
import "./MatchData.css"; // Import the CSS file
import { motion } from "framer-motion";
import axios from "axios";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";

const WwcdTeamStats = () => {
  const [matchData, setMatchData] = useState([]);
  const [setupData, setSetupData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [primaryColor, setPrimaryColor] = useState(); // Initialize the primary color state

  const urlMatchData =
    "https://script.google.com/macros/s/AKfycbwwGSnNqWr2FZpEs8l6EAkCjb9miZAJ-X8PyFMcS8kvE3kQ-h_XZk5wQT8-p07-tyF5hA/exec";

  const urlSetupData = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`;

  useEffect(() => {
    // Fetch match data
    axios
      .get(urlMatchData)
      .then((response) => {
        const data = response.data;
        if (data.error) {
          setError(data.error);
        } else {
          setMatchData(data.match_info);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching data.");
        setLoading(false);
      });

    // Fetch setup data
    axios
      .get(urlSetupData)
      .then((response) => {
        const setupValues = response.data.values;
        if (setupValues) {
          const formattedSetupData = setupValues.map((row) => ({
            ColumnB: row[1] || "",
          }));
          setSetupData(formattedSetupData);
          // Set the primary color from the setup data
          setPrimaryColor(setupValues[5]?.[1] || "#850505"); // Default color
        }
      })
      .catch(() => {
        setError("Error fetching setup data.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (matchData.length === 0) return <p>No match data available.</p>;

  // Find the winning team (team with highest total points)
  const winningTeam = matchData.reduce((prev, current) =>
    prev.total_points > current.total_points ? prev : current
  );

  // Get the 4 players from the winning team
  const winningPlayers = matchData
    .filter((player) => player.team_name === winningTeam.team_name)
    .slice(0, 4); // Get first 4 players

  return (
    <div className="font-bebas-neue font-[500]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 10 }}
        transition={{ duration: 2 }}
      >
        <div className="w-[1980px] h-[1080px] font-bebas-neue font-[500] text-white relative ">
          <div className="text-[280px] absolute top-[230px] ml-[30px]">
            WWCD
          </div>
          <div className="text-[140px] absolute top-[490px] ml-[50px]">
            TEAM STATS
          </div>
          <div
            className="w-[600px] h-[88px] absolute top-[870px] ml-[30px] left-[970px] scale-150 text-center"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="font-teko font-[300] text-[79px] ml-[10px] mt-[-13px] ">
              {setupData[2]?.ColumnB} | MATCH - {setupData[4]?.ColumnB}
            </div>
          </div>
          <div className="w-[250px] h-[250px] ml-[20px] absolute top-[700px]">
            <img
              src={winningTeam.team_logo}
              alt={winningTeam.team_name}
              className="w-full h-full"
            />
          </div>
          <div className="ml-[270px] absolute top-[690px] text-[200px]">
            {winningTeam.team_name}
          </div>

          {/* Player Names */}
          <div className="absolute left-[610px] top-[0px] flex gap-4">
            {winningPlayers.map((player, index) => (
              <div
                key={index}
                style={{ backgroundColor: primaryColor }}
                className="w-[323px] h-[700px]  before text-white text-[30px] font-bold shadow-lg"
              >
                {/* Image with Clipping Mask */}
                <div className="w-[500px] h-[500px] relative top-[200px] left-[4px]">
                  <img
                    src={
                      player.player_photo ||
                      "https://res.cloudinary.com/dqckienxj/image/upload/v1737809848/Layer_6_cnd9gl_ugaxek.png"
                    }
                    alt={player.player_name}
                    className="w-[100%] h-[100%]"
                    style={{
                      clipPath: "polygon(0 0, 64% 0, 63.6% 100%, 0% 100%)",
                    }}
                  />
                </div>
                <div className="w-[324px] h-[500px] absolute bg-gradient-to-t from-black via-transparent to-[#ffffff00] top-[200px]"></div>
                {/* Player Name */}
                <div
                  className="relative top-[200px] left-[0px] w-[323px] h-[80px] text-center font-teko font-[300] "
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="text-[80px]  top-[-18px] relative">
                    {player.player_name}
                  </div>
                </div>

                {/* Kills Count */}
                <div className="relative top-[0px] left-[20px] text-white">
                  <div className="flex flex-col">
                    <div
                      className="mt-[-100px] text-[90px] relative top-[-40px]"
                      style={{ color: primaryColor }}
                    >
                      {player.player_kills}
                    </div>
                    <span className="font-teko font-[300] relative top-[-80px] left-[3px]">
                      Kills
                    </span>
                  </div>
                </div>
                <div className="relative top-[0px] left-[20px] text-white flex flex-col">
                  <div
                    className="mt-[-100px] text-[90px] relative top-[-10px]"
                    style={{ color: primaryColor }}
                  >
                    {player.contribution}%
                  </div>
                  <span className="font-teko font-[300] relative top-[-50px] left-[3px]">
                    CONTRIBUTION
                  </span>
                </div>
                <div className="w-[323px] h-[770px] bg-[#000000dc] before text-white text-[30px] font-bold shadow-lg mt-[-750px]"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WwcdTeamStats;
