import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const setupRange = "setup!A2:B10"; // Range for setup data (like primary color)
const displayRange = "display!A21:B37"; // Range for visibility check (including B27)

const UpperStats = () => {
  const [matchData, setMatchData] = useState([]);
  const [primaryColor, setPrimaryColor] = useState("#ff0000"); // Default primary color
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true); // State to manage visibility

  const matchDataUrl =
    "https://script.google.com/macros/s/AKfycbwwGSnNqWr2FZpEs8l6EAkCjb9miZAJ-X8PyFMcS8kvE3kQ-h_XZk5wQT8-p07-tyF5hA/exec";

  const setupDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${setupRange}?key=${apiKey}`;
  const displayDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${displayRange}?key=${apiKey}`;

  // Fetch the setup data (sheet data) for primary color
  const fetchSetupData = async () => {
    try {
      const response = await fetch(setupDataUrl);
      const data = await response.json();

      if (data && data.values && data.values.length > 0) {
        // Find the row that contains "PRIMARY COLOR"
        const primaryColorRow = data.values.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1] || "#ff0000"); // Set primary color from sheet
        }
      }
    } catch (err) {
      console.error("Error fetching setup data:", err);
      setError(err.message);
    }
  };

  // Fetch the display data for visibility check (cell B27)
  // Fetch the display data for visibility check (cell B27)
  const fetchDisplayData = async () => {
    try {
      const response = await fetch(displayDataUrl);
      const data = await response.json();

      if (data && data.values && data.values.length > 0) {
        // Find the row that contains "Upper Stats"
        const upperStatsRow = data.values.find(
          (row) => row[0] === "Upper Stats"
        );

        if (upperStatsRow && upperStatsRow[1] === "TRUE") {
          setIsVisible(true); // Set to true if the value is "TRUE"
        } else {
          setIsVisible(false); // Set to false otherwise
        }
      }
    } catch (err) {
      console.error("Error fetching display data:", err);
      setError(err.message);
    }
  };

  // Fetch the match data
  const fetchMatchData = async () => {
    try {
      const response = await fetch(matchDataUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        const uniqueData = data.match_info.reduce((acc, team) => {
          if (!acc.some((item) => item.team_name === team.team_name)) {
            acc.push(team);
          }
          return acc;
        }, []);

        uniqueData.sort((a, b) => b.team_kills - a.team_kills); // Sort teams by team kills

        // Show only teams with Alive >= 1 and non-empty team names
        const aliveTeams = uniqueData.filter(
          (team) => team.Alive >= 1 && team.team_name !== ""
        );
        setMatchData(aliveTeams);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMatchData();
    fetchSetupData();
    fetchDisplayData(); // Fetch visibility state initially

    // Fetch data every 6 seconds for match data
    const matchDataIntervalId = setInterval(fetchMatchData, 6500);

    // Fetch visibility data every 20 seconds
    const displayDataIntervalId = setInterval(fetchDisplayData, 60000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(matchDataIntervalId);
      clearInterval(displayDataIntervalId);
    };
  }, []);

  if (error) return <p>{error}</p>;

  if (!isVisible) return null; // Do not render if visibility is false

  return (
    <div className="w-[1920px] h-[1080px]">
      <div className="flex gap-[120px] w-full h-[80px] font-bebas-neue font-[300] justify-center scale-75 ml-[-20px]">
        {matchData.map((team, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -1080 }} // Start off-screen (top)
            animate={{ opacity: 1, y: 0 }} // Fade in and move to its position
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center h-[90px] w-[330px] p-2 top-[40px] relative bg-white"
          >
            {/* Team Logo */}
            <div className="w-[80px] h-[80px]">
              <img
                src={
                  team.team_logo ||
                  "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                }
                alt="team logo"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Team Name */}
            <div className="text-[70px] ml-[10px]">{team.team_name}</div>
            <div className="bg-black w-[140px] absolute h-[90px] left-[250px] ml-[0px] border-solid border-[2px] border-white">
              {/* Alive Count */}
              <div className="flex gap-[7px] relative left-[20px] top-[10px]">
                {Array.from({ length: Math.min(team.Alive, 4) }).map(
                  (_, index) => (
                    <div
                      key={index}
                      className="w-[20px] h-[70px] bg-red-800"
                      style={{
                        backgroundColor: primaryColor, // Dynamically using fetched primaryColor
                      }}
                    ></div>
                  )
                )}
              </div>
            </div>
            <div
              className="bg-red-800 w-[390px] h-[80px] absolute top-[100px] left-[0px] right-[0px]"
              style={{ backgroundColor: primaryColor }} // Dynamically using fetched primaryColor
            >
              <div className="text-white text-[52px] absolute ml-[40px] mt-[-0px]">
                WWCD CHANCE{" "}
                <span className="relative left-[20px]">
                  {team.wwcd_chance}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UpperStats;
