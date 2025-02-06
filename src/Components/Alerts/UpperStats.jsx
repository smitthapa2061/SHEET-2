import React, { useState, useEffect } from "react";

const apiKey = "AIzaSyCgDkaR7IVZDB6INAyjHNRcu3brZfoWpSA"; // Your Google Sheets API key
const spreadsheetId = "1u1t50nxdhlZimY3vsOlM6452gBauTZZ0g2UdfRsj7T8"; // Your Google Sheets ID

const setupRange = "setup!A2:B10"; // Range for setup data (like primary color)
const displayRange = "display!A21:B37"; // Range for display data

const UpperStats = () => {
  const [matchData, setMatchData] = useState([]);
  const [primaryColor, setPrimaryColor] = useState("#ff0000"); // Default primary color
  const [error, setError] = useState(null);
  const [displayStats, setDisplayStats] = useState(false); // State to track whether to display UpperStats

  const matchDataUrl =
    "https://script.google.com/macros/s/AKfycbxlx6rdVGhCu8ro9Isz6joQHxY60sx6yUq3a-y9nQFZ8PxvXyOzjd7AFcY5Qv_dP0rHXA/exec";

  // Correct API URL for fetching setup data
  const setupDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${setupRange}?key=${apiKey}`;
  const displayDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${displayRange}?key=${apiKey}`;

  // Fetch the setup data (sheet data) for primary color
  const fetchSetupData = async () => {
    try {
      const response = await fetch(setupDataUrl);
      const data = await response.json();

      if (data && data.values && data.values.length > 0) {
        // Assuming primary color is in the row with "PRIMARY COLOR"
        const primaryColorRow = data.values.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1] || "#ff0000"); // Set the primary color from the sheet
        }
      }
    } catch (err) {
      console.error("Error fetching setup data:", err);
      setError(err.message);
    }
  };

  // Fetch the display data (sheet data) to check if B27 is TRUE
  const fetchDisplayData = async () => {
    try {
      const response = await fetch(displayDataUrl);
      const data = await response.json();

      // Check if B27 is "TRUE"
      const displayRow = data.values.find((row, index) => index === 6); // B27 is row 6 (since index is 0-based)
      if (displayRow && displayRow[1] === "TRUE") {
        setDisplayStats(true); // If B27 is TRUE, show stats
      } else {
        setDisplayStats(false); // Hide stats otherwise
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

        // Set match data without filtering top 4, and show only teams with Alive >= 1
        const aliveTeams = uniqueData.filter(
          (team) => team.Alive >= 1 && team.team_name !== ""
        ); // Filter teams with Alive >= 1 and non-empty team_name
        setMatchData(aliveTeams);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchMatchData();
    fetchSetupData();
    fetchDisplayData();

    // Fetch match data every 5 seconds
    const matchDataIntervalId = setInterval(fetchMatchData, 6000);

    // Fetch display data every 15 seconds
    const displayDataIntervalId = setInterval(fetchDisplayData, 20000);

    // Cleanup intervals on unmount
    return () => {
      clearInterval(matchDataIntervalId);
      clearInterval(displayDataIntervalId);
    };
  }, []);

  if (error) return <p>{error}</p>;

  if (!displayStats) return;

  return (
    <div className="w-[1920px] h-[1080px]">
      <div className="flex gap-[120px] w-full h-[80px] font-bebas-neue font-[300] justify-center scale-75 ml-[-20px]">
        {matchData
          .filter((team) => team.Alive >= 1 && team.team_name !== "") // Filter teams with Alive >= 1 and non-empty team_name
          .map((team, index) => (
            <div
              key={index}
              className="flex items-center h-[90px] w-[330px] p-2 top-[40px] relative bg-white"
            >
              {/* Team Logo */}
              <div className="w-[80px] h-[80px]">
                <img
                  src={team.team_logo}
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
            </div>
          ))}
      </div>
    </div>
  );
};

export default UpperStats;
