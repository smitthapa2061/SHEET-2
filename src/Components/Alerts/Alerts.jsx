import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";
const Alerts = () => {
  const [matchAlerts, setMatchAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latestDeadTeam, setLatestDeadTeam] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#b31616"); // Default primary color

  const prevMatchAlerts = useRef([]);
  const displayedDeadTeams = useRef(new Set());

  const url =
    "https://script.google.com/macros/s/AKfycbwwGSnNqWr2FZpEs8l6EAkCjb9miZAJ-X8PyFMcS8kvE3kQ-h_XZk5wQT8-p07-tyF5hA/exec";
  const setupUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`; // Setup range

  useEffect(() => {
    // Fetch Setup Data for primary color
    const fetchSetupData = async () => {
      try {
        const response = await axios.get(setupUrl);
        const setupValues = response.data.values;

        const primaryColorRow = setupValues.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorRow) {
          setPrimaryColor(primaryColorRow[1]); // Set primary color from setup data
        }
      } catch (err) {
        console.error("Error fetching setup data:", err);
      }
    };

    fetchSetupData();

    const fetchData = () => {
      axios
        .get(`${url}?t=${new Date().getTime()}`)
        .then((response) => {
          if (response.data.error) {
            setError(response.data.error);
          } else {
            const uniqueTeams = [];
            const teamNames = new Set();
            response.data.match_info.forEach((team) => {
              if (!teamNames.has(team.team_name)) {
                teamNames.add(team.team_name);
                uniqueTeams.push(team);
              }
            });

            if (
              JSON.stringify(uniqueTeams) !==
              JSON.stringify(prevMatchAlerts.current)
            ) {
              setMatchAlerts(uniqueTeams);
              prevMatchAlerts.current = uniqueTeams;

              uniqueTeams.forEach((team) => {
                if (
                  team.Alive === 0 &&
                  !displayedDeadTeams.current.has(team.team_name)
                ) {
                  setLatestDeadTeam(team); // Store the entire team object
                  displayedDeadTeams.current.add(team.team_name);

                  setTimeout(() => {
                    setLatestDeadTeam(null);
                  }, 5000); // Hide after 5 seconds
                }

                if (team.Alive > 0) {
                  displayedDeadTeams.current.delete(team.team_name);
                }
              });
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching data.");
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 6000);
    return () => clearInterval(intervalId);
  }, [url]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (matchAlerts.length === 0) return <p>No match data available.</p>;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 2 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 1 }}
      >
        <div className="flex justify-center font-bebas-neue font-[500] absolute top-[30px] left-[680px]">
          {latestDeadTeam && (
            <div
              className="w-[500px] h-[200px] mt-[50px]"
              style={{ backgroundColor: primaryColor }} // Dynamic background color
            >
              <div className="absolute ml-[219px] text-[60px] text-white  top-[47px]">
                TEAM {latestDeadTeam.team_name || "NAME"}
              </div>

              <div className="bg-white w-[200px] h-[100%] mb-[-20px] ">
                <img
                  src={
                    latestDeadTeam.team_logo ||
                    "https://res.cloudinary.com/dqckienxj/image/upload/v1727161652/default_nuloh2.png"
                  }
                  alt="logo"
                  className="w-[180px] h-[160px] absolute "
                />
              </div>
              <div className="w-[280px] bg-white h-[1px] relative bottom-[100px] left-[210px] "></div>
              <div className="font-[orbitron] text-white absolute ml-[250px] text-[30px] top-[140px]">
                POSITION
                <span className="font-[orbitron] text-black absolute ml-[12px] text-[30px] top-[-2px] bg-white w-[80px] pl-[10px]">
                  {latestDeadTeam.team_position || 0}
                </span>
              </div>
              <div className="font-[orbitron] text-white absolute ml-[310px] text-[30px] top-[200px]">
                KILLS
                <span className="font-[orbitron] text-black absolute ml-[9px] text-[30px] top-[-2px] bg-white w-[80px] pl-[10px]">
                  {latestDeadTeam.team_kills || 0}
                </span>
              </div>
              <div className="bg-[#000000] absolute text-center left-[0px] w-[200px] h-[50px] mt-[-31px] text-white  text-[40px]">
                ELIMINATED
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Alerts;
