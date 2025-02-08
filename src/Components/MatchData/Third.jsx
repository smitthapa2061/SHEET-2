import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ";
const range = "overall1!A2:G25"; // Range for overall data
const range2 = "setup!A2:B10"; // Range for setup data (primary color)

const fadeInAnimation = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Third = () => {
  const [data, setData] = useState([]);
  const [top1, setTop1] = useState(null);
  const [primaryColor, setPrimaryColor] = useState("#FF0000"); // Default red color
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from Google Sheets API
    const fetchData = async () => {
      try {
        // Fetch main team data
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get(url);
        const values = response.data.values || [];

        // Process data
        const formattedData = values.map((row) => ({
          teamTag: row[0] || "",
          teamLogo: row[1] || "https://default-image-url.com", // Fallback logo
          totalkills: row[3] || 0,
          rankpoint: row[4] || 0,
          totalpoints: row[2] || 0,
        }));

        setData(formattedData);

        // Fetch primary color data
        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get(url2);
        const values2 = response2.data.values || [];

        // Extract primary color
        const primaryColorValue = values2.find(
          (row) => row[0] === "PRIMARY COLOR"
        );
        if (primaryColorValue) {
          setPrimaryColor(primaryColorValue[1] || "#FF0000"); // Fallback to red if no color found
        }

        // Set top 1 data
        const sortedData = formattedData.sort(
          (a, b) => b.totalpoints - a.totalpoints
        );
        setTop1(sortedData[2]); // Assuming the top team is the one with the highest total points
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(); // Fetch the data when the component mounts
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!top1) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {top1 && (
        <motion.div
          variants={fadeInAnimation} // Using the fadeInAnimation defined above
          initial="hidden"
          animate="visible"
          className="Group6 h-[1080px] w-[1920px]"
          style={{ position: "relative" }}
        >
          <div className="h-[1080px] flex w-[1920px] items-end">
            <motion.img
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[116px] "
              src="https://res.cloudinary.com/drs0qtuhd/image/upload/v1720701131/dasa_ud7fw0.png"
              alt="Team Image"
            />
            <motion.img
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[424px]"
              src="https://res.cloudinary.com/drs0qtuhd/image/upload/v1720701131/dasa_ud7fw0.png"
              alt="Team Image"
            />
            <motion.img
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[800px]"
              src="https://res.cloudinary.com/drs0qtuhd/image/upload/v1720701038/pubg-helmet-guy-2020-4k-cy_mdnk9n.png"
              alt="Player Image"
            />
            <motion.img
              initial={{ x: -800 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-[800px] relative right-[1108px]"
              src="https://res.cloudinary.com/drs0qtuhd/image/upload/v1720701038/pubg-helmet-guy-2020-4k-cy_mdnk9n.png"
              alt="Player Image"
            />
          </div>
          <div className="relative bottom-[300px]">
            <div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="Rectangle8 w-[1920px] h-0.5"
              ></div>
              <div className="Rectangle8 relative -top-0.5 w-[300px] h-0.5 bg-white"></div>
            </div>

            <div className="flex relative bottom-0.5">
              <div className="w-[300px] h-[300px] bg-white">
                <div
                  style={{ backgroundColor: primaryColor }}
                  className="h-14 font-tungsten text-white bg-red-500"
                >
                  <div className="flex justify-center font-[300] items-start text-6xl text-white font-teko">
                    {top1.teamTag}
                  </div>
                  <img
                    className="relative left-3 h-[230px]"
                    src={top1.teamLogo}
                    alt="Team Logo"
                  />
                </div>
              </div>
              <div
                style={{ backgroundColor: primaryColor }}
                className="h-[300px] w-[1620px]"
              >
                <div>
                  <div className="h-[250px] w-[1620px] bg-black">
                    <motion.div
                      initial={{ opacity: 0, y: -40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex justify-center font-bebas-neue  items-start relative bottom-[55px] text-[256px] text-white"
                    >
                      2ND RUNNER UP
                    </motion.div>
                  </div>
                  <div className="flex w-[1620px] justify-evenly items-center">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex font-[300] items-start text-6xl text-white font-teko"
                    >
                      RANK-3
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      KILLS-{top1.totalkills}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko"
                    >
                      PLACE-{top1.rankpoint}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex justify-center font-[300] items-start text-6xl text-white font-teko "
                    >
                      TOTAL-{top1.totalpoints}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Third;
