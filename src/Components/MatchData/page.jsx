import React, { useState, useEffect } from "react";
import "./MatchData.css"; // Import the CSS file
import axios from "axios";
import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";

const MatchData = () => {
  const [matchData, setMatchData] = useState([]);
  const [setupData, setSetupData] = useState([]); // State for setup sheet data
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // Add state for currentPage

  const urlMatchData =
    "https://script.google.com/macros/s/AKfycbwwGSnNqWr2FZpEs8l6EAkCjb9miZAJ-X8PyFMcS8kvE3kQ-h_XZk5wQT8-p07-tyF5hA/exec";

  const urlSetupData = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/setup!A2:B10?key=${apiKey}`; // Use your API key here

  useEffect(() => {
    // Fetch match data
    axios
      .get(urlMatchData)
      .then((response) => {
        const data = response.data;

        if (data.error) {
          setError(data.error);
        } else {
          // Remove duplicates based on team_name and filter out rows with player_rank
          const uniqueData = data.match_info
            .filter((team) => !team.player_rank) // Exclude rows where player_rank is truthy
            .reduce((acc, team) => {
              if (!acc.some((item) => item.team_name === team.team_name)) {
                acc.push(team);
              }
              return acc;
            }, []);

          // Sort the data by total_points in descending order
          uniqueData.sort((a, b) => b.total_points - a.total_points);

          setMatchData(uniqueData);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data.");
        setLoading(false);
      });

    // Fetch setup data
    axios
      .get(urlSetupData)
      .then((response) => {
        const setupValues = response.data.values;

        if (setupValues) {
          // Prepare the setup data, assuming it has the format you need
          const formattedSetupData = setupValues.map((row) => ({
            ColumnB: row[1] || "", // Using column B as an example
          }));
          setSetupData(formattedSetupData);
        }
      })
      .catch((err) => {
        setError("Error fetching setup data.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentPage === 1) {
      const timer = setTimeout(() => {
        setCurrentPage(2); // Change to page 2 after 12 seconds
      }, 25000);

      return () => clearTimeout(timer); // Clean up the timer on unmount
    }
  }, [currentPage]);

  const pageData =
    currentPage === 1
      ? matchData.filter(
          (team, index) => index >= 5 && index <= 13 && team.team_name // Page 1: Show 6th to 14th teams
        )
      : matchData.filter(
          (team, index) => index >= 14 && index <= 24 && team.team_name // Page 2: Show 14th to 22nd teams
        );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (matchData.length === 0) {
    return <p>No match data available.</p>;
  }

  const primaryColor = setupData[5]?.ColumnB || "#850505"; // Default to red if API fails

  return (
    <div className="font-bebas-neue font-[500]">
      <motion.div
        key="matchData"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 2 }}
      >
        {/*#1 data start*/}
        <div className=" ">
          {matchData?.slice(0, 1).map(
            (team, index) =>
              team.team_name &&
              team.total_points ===
                Math.max(...matchData.map((t) => t.total_points)) && ( // Check if team_name exists
                <div key={index}>
                  <div className="w-[1980px] h-[1080px]  font-bebas-neue font-[500] text-white relative ">
                    <div
                      className="bg-red-800 w-[300px] h-[120px]  left-[1140px] absolute top-[30px] text-center text-[50px] "
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div
                        className="relative bg-white text-black bottom-[8px]"
                        style={{ Color: primaryColor }}
                      >
                        DAY - {setupData[3]?.ColumnB}
                      </div>
                      <div className="relative bottom-[18px]">
                        MATCH - {setupData[4]?.ColumnB}
                      </div>
                    </div>
                    <div className="text-[150px]   absolute text-white w-[100%] h-[100%] text-center bottom-[20px] right-[230px]">
                      MATCH RANKING
                    </div>

                    <div className="relative right-[70px]">
                      <div
                        className="bg-[#000000bc] w-[942px] h-[360px] relative left-[100px] top-[180px] border-red-800 border-[4px]"
                        style={{ borderColor: primaryColor }}
                      >
                        <div className="text-[80px] relative left-[15px] mb-[-122px]">
                          {index + 1}
                        </div>
                        <div className="flex left-[20px] relative bottom-[20px]">
                          <div>
                            <div className="w-[400px] h-[250px] relative top-[46px] right-[60px] z-0">
                              <img
                                src={
                                  team.player_photo ||
                                  "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                                }
                                alt=""
                                className=""
                              />
                            </div>
                          </div>
                          <div>
                            <div className="w-[400px] h-[250px] relative top-[46px] right-[250px] z-10">
                              <img
                                src={
                                  team.player_photo ||
                                  "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                                }
                                alt=""
                                className=""
                              />
                            </div>
                          </div>
                          <div>
                            <div className="w-[400px] h-[250px] relative top-[46px] right-[440px] z-0">
                              <img
                                src={
                                  team.player_photo ||
                                  "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                                }
                                alt=""
                                className=""
                              />
                            </div>
                          </div>
                          <div>
                            <div className="w-[400px] h-[250px] relative top-[46px] right-[640px] z-10">
                              <img
                                src={
                                  team.player_photo ||
                                  "https://res.cloudinary.com/dqckienxj/image/upload/v1735762279/defult_chach_apsjhc_dwnd7n.png"
                                }
                                alt=""
                                className=""
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex ">
                        <div
                          className="bg-red-800 w-[490px] h-[130px] relative left-[100px] top-[187px]"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <div className="w-[140px] h-[140px] ">
                            <img
                              src={
                                team.team_logo ||
                                "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                              }
                              alt=""
                              className=""
                            />
                          </div>
                          <div className="w-[2px] h-[110px] bg-white relative left-[140px] bottom-[130px]"></div>
                          <div className="relative text-[100px] text-[white]  bottom-[255px] left-[160px]">
                            {team.team_name}
                          </div>
                          {team.chicken === 1 ? (
                            <div className="w-[80px] h-[80px] relative bottom-[380px] left-[400px]">
                              <img
                                src="https://res.cloudinary.com/dqckienxj/image/upload/v1735721889/roast-chicken_kjcdkw.png"
                                alt=""
                              />
                            </div>
                          ) : (
                            <div></div>
                          )}
                        </div>

                        <div className="bg-[#000000bc] w-[150px] h-[130px] relative left-[100px] top-[187px]">
                          <div className="text-[100px] text-center">
                            {team.team_position}
                          </div>
                        </div>
                        <div
                          className="bg-red-800 w-[150px] h-[130px] relative left-[100px] top-[187px]"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <div className="text-[100px] text-center">
                            {team.team_kills}
                          </div>
                        </div>
                        <div className="bg-[#000000bc] w-[150px] h-[130px] relative left-[100px] top-[187px]">
                          <div className="text-[100px] text-center">
                            {team.total_points}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
          )}
          {/*#1 data ends*/}

          {/*#2-4 data starts*/}
          {matchData
            ?.filter(
              (team) =>
                team.team_name && // Check if team_name exists
                team.total_points !==
                  Math.max(...matchData.map((t) => t.total_points))
            ) // Exclude the highest total_points
            .slice(0, 4) // Show from the second highest to the fifth highest
            .map((team, index) => (
              <motion.div
                className="relative left-[33px] bottom-[395px] mb-[10px] text-white flex"
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.2,
                }} // Staggered animation
              >
                <div className="flex text-[60px] text-center ">
                  <div
                    className="w-[100px] h-[80px] bg-red-800 "
                    style={{ backgroundColor: primaryColor }}
                  >
                    {index + 2}
                  </div>
                  <div className="w-[392px] h-[80px] bg-[#000000bc] flex">
                    <div className="w-[90px] h-[90px] relative left-[5px]">
                      <img
                        src={
                          team.team_logo ||
                          "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="w-[2px] h-[68px] bg-white mt-[5px]"></div>
                    <div className="ml-[8px]">{team.team_name}</div>
                    {team.chicken === 1 ? (
                      <div className="w-[65px] h-[65x] relative top-[6px] left-[90px] ">
                        <img
                          src="https://res.cloudinary.com/dqckienxj/image/upload/v1735721889/roast-chicken_kjcdkw.png"
                          alt="img"
                        />
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>

                  <div
                    className="w-[148px] h-[80px] bg-red-800 "
                    style={{ backgroundColor: primaryColor }}
                  >
                    {team.team_position}
                  </div>
                  <div className="w-[148px] h-[80px] bg-[#000000bc] text-ce">
                    {team.team_kills}
                  </div>
                  <div
                    className="w-[148px] h-[80px] bg-red-800"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {team.total_points}
                  </div>
                </div>
              </motion.div>
            ))}
          {/*#2-4 data ends*/}

          <div
            className="w-[936px] h-[30px] border-solid border-red-800 border-[2px] bg-white relative left-[1000px] bottom-[1261px] text-red-500 font-[orbitron] font-[900] text-[20px]"
            style={{ borderColor: primaryColor, color: primaryColor }}
          >
            <div className="relative left-[40px]">#</div>
            <div className="relative left-[120px] bottom-[28px]">TEAM</div>
            <div className="relative left-[525px] bottom-[58px]">PLACE</div>
            <div className="text-[20px] relative left-[680px] bottom-[88px]">
              KILLS
            </div>
            <div className="text-[20px] relative left-[820px] bottom-[118px]">
              TOTAL
            </div>
          </div>

          {pageData.map((team, index) => (
            <motion.div
              className="relative left-[1000px] bottom-[1250px] mb-[10px] text-white flex"
              key={`${currentPage}-${index}`} // Ensure a unique key per page switch
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.2,
              }} // Staggered animation
            >
              <div className="flex text-[60px] text-center">
                <div
                  className="w-[100px] h-[80px] bg-red-800 "
                  style={{ backgroundColor: primaryColor }}
                >
                  {/* Adjust index based on currentPage */}
                  {currentPage === 1 ? index + 6 : index + 15}
                </div>
                <div className="w-[392px] h-[80px] bg-[#000000bc] flex">
                  <div className="w-[90px] h-[90px] relative left-[5px]">
                    <img
                      src={
                        team.team_logo ||
                        "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="w-[2px] h-[68px] bg-white mt-[5px]"></div>
                  <div className="ml-[8px]">{team.team_name}</div>
                  {team.chicken === 1 ? (
                    <div className="w-[65px] h-[65px] relative top-[6px] left-[150px]">
                      <img
                        src="https://res.cloudinary.com/dqckienxj/image/upload/v1735721889/roast-chicken_kjcdkw.png"
                        alt="img"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div
                  className="w-[148px] h-[80px] bg-red-800 "
                  style={{ backgroundColor: primaryColor }}
                >
                  {team.team_position}
                </div>
                <div className="w-[148px] h-[80px] bg-[#000000bc] text-ce">
                  {team.team_kills}
                </div>
                <div
                  className="w-[148px] h-[80px] bg-red-800"
                  style={{ backgroundColor: primaryColor }}
                >
                  {team.total_points}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MatchData;
