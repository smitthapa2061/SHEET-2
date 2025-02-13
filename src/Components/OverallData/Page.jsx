import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { motion } from "framer-motion";

const apiKey = "AIzaSyBd_goawSN9ikX7mqdW0r4H4WrH3T7eBEw"; // Your Google Sheets API key
const spreadsheetId = "1LeFzBRavciItt15hqSjrJn81O2eNpKa0a0-LQG3fwwQ"; // Your Google Sheets ID
const range = "overall1!A2:G25"; // Range you want to fetch (adjust this as needed)
const range2 = "setup!A2:B10"; // Another range for setup data

const Overall = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data from Google Sheets API using Axios
    const fetchData = async () => {
      try {
        // Fetch main data from Google Sheets
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
        const response = await axios.get(url);

        const values = response.data.values || [];

        // Format the fetched data
        const formattedData = values
          .map((row) => ({
            ColumnA: row[0] || null, // Team Name
            ColumnB:
              row[1] ||
              "https://res.cloudinary.com/dqckienxj/image/upload/v1730785916/default_ryi6uf_edmapm.png", // Logo URL
            ColumnC: row[2] || 0, // Kills
            ColumnD: row[3] || 0, // Placement
            ColumnE: row[4] || 0, // WWCD
            ColumnF: row[5] || 0, // Total Score
            ColumnG: row[6] || 0, // Sorting Score
          }))
          .filter((row) => row.ColumnA); // Remove empty rows

        // Sort data by kills (ColumnC) and WWCD (ColumnE) for tie-breaking
        const sortedData = formattedData.sort((a, b) => {
          const killsDifference = parseInt(b.ColumnC) - parseInt(a.ColumnC);
          if (killsDifference !== 0) return killsDifference;
          return parseInt(b.ColumnE) - parseInt(a.ColumnE);
        });

        setData(sortedData); // ✅ Now we set sorted data correctly

        // Fetch additional setup data
        const url2 = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range2}?key=${apiKey}`;
        const response2 = await axios.get(url2);
        const values2 = response2.data.values || [];

        const formattedData2 = values2.map((row) => ({
          ColumnB: row[1] || "",
        }));

        setData2(formattedData2);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData(); // Call fetchData when the component mounts
  }, []);

  // Dynamically divide data into two equal parts
  // Sort data by ColumnF (Total Score) in descending order before splitting
  const sortedData = [...data].sort((a, b) => {
    // First, compare by ColumnC (total)
    const killsDifference = parseFloat(b.ColumnC) - parseFloat(a.ColumnC);

    if (killsDifference !== 0) {
      return killsDifference; // If Kills are different, use that for sorting
    }

    // If total (ColumnC) are the same, compare by ColumnE (position)
    return parseFloat(b.ColumnE) - parseFloat(a.ColumnE); // Compare WWCD for tie-breaking
  });

  const half = Math.ceil(sortedData.length / 2);
  const firstColumnData = sortedData.slice(0, half); // Top-ranking teams
  const secondColumnData = sortedData.slice(half); // Lower-ranking teams

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" w-[1920px] h-[1080px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }} // Fade out on exit
        transition={{ duration: 0.5 }}
      >
        <div className="text-white text-[130px] font-[500] text-center mb-[-100px] font-bebas-neue relative top-[-15px]">
          OVERALL RANKING
        </div>
        {data2.length > 0 && (
          <div>
            <div
              style={{
                backgroundColor: `${data2[5].ColumnB}`,
              }}
              className="w-[1000px] h-[60px] bg-[white] mb-[-40px] relative left-[465px] text-[40px] text-white font-[orbitron] font-[800]  text-center tracking-wider top-[50px]"
            >
              <div className="relative top-[0px]">
                {data2[2].ColumnB} | DAY - {data2[3].ColumnB} | MATCH -{" "}
                {data2[4].ColumnB}
              </div>
            </div>
            <div
              style={{
                borderColor: `${data2[5].ColumnB}`,
              }}
              className="w-[769px] h-[35px] bg-white mb-[-80px] relative left-[145px] border-red-800 border-[1px] top-[110px]"
            >
              <div className="flex ">
                <div
                  style={{
                    color: `${data2[5].ColumnB}`,
                  }}
                  className="flex font-[orbitron] font-[800] text-[20px] text-red-800 tracking-wider "
                >
                  <div className="  ml-[40px] ">#</div>
                  <div className="  ml-[40px] ">TEAM</div>
                  <div className="  ml-[190px] ">WWCD</div>
                  <div className="  ml-[23px] ">PLACE</div>
                  <div className="  ml-[23px] ">KILLS</div>
                  <div className="  ml-[23px] ">TOTAL</div>
                </div>
              </div>
              <div
                style={{
                  borderColor: `${data2[5].ColumnB}`,
                }}
                className="w-[769px] h-[35px] bg-white mb-[2px] relative left-[839px] border-red-800 border-[1px] top-[-32px]"
              >
                <div
                  style={{
                    color: `${data2[5].ColumnB}`,
                  }}
                  className="flex font-[orbitron] font-[800] text-[20px] text-red-800 tracking-wider "
                >
                  <div className="  ml-[40px] ">#</div>
                  <div className="  ml-[40px] ">TEAM</div>
                  <div className="  ml-[190px] ">WWCD</div>
                  <div className="  ml-[23px] ">PLACE</div>
                  <div className="  ml-[23px] ">KILLS</div>
                  <div className="  ml-[23px] ">TOTAL</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 relative top-[180px] font-bebas-neue font-[500] left-[10px]">
              {/* First Column */}
              <ul>
                {firstColumnData.map((row, index) => (
                  <motion.div
                    className="p-4 mb-2 w-[800px] h-[65px] relative left-[120px] flex"
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }} // Staggered animation
                  >
                    {/* First Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[150px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">{index + 1}</div>
                    </div>

                    {/* Second Black Box */}
                    <div className="bg-[#000000cf] w-[460px] h-[63px] flex">
                      <div className="w-[62px] h-[62px]">
                        <img
                          src={row.ColumnB || null}
                          alt="data"
                          className="w-full h-full"
                        />
                      </div>

                      <div className="text-white text-[58px] mt-[-7px] ml-[10px]">
                        {row.ColumnA}
                      </div>
                    </div>

                    {/* Third Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[180px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">{row.ColumnF}</div>
                    </div>

                    {/* Fourth Black Box */}
                    <div className="bg-[#000000cf] w-[180px] h-[63px] flex justify-center items-center">
                      <div className="text-white text-[58px] relative top-[5px]">
                        {row.ColumnE}
                      </div>
                    </div>

                    {/* Fifth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[180px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[5px]">{row.ColumnD}</div>
                    </div>

                    {/* Sixth Black Box */}
                    <div className="bg-[#000000cf] w-[180px] h-[63px] flex justify-center items-center">
                      <div className="text-white text-[58px] relative top-[5px]">
                        {row.ColumnC}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="bg-white w-[3px] h-[63px]"></div>
                  </motion.div>
                ))}
              </ul>

              {/* Second Column */}
              <ul>
                {secondColumnData.map((row, index) => (
                  <motion.div
                    className="p-4 mb-2 w-[800px] h-[65px] relative right-[10px] flex"
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                      delay: index * 0.2,
                    }} // Staggered animation
                  >
                    {/* First Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[150px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">
                        {index + half + 1}
                      </div>
                    </div>

                    {/* Second Black Box */}
                    <div className="bg-[#000000cf] w-[460px] h-[63px] flex">
                      <div className="w-[62px] h-[62px]">
                        <img
                          src={row.ColumnB}
                          alt=""
                          className="w-full h-full"
                        />
                      </div>

                      <div className="text-white text-[58px] mt-[-8px] ml-[10px]">
                        {row.ColumnA}
                      </div>
                    </div>

                    {/* Third Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[180px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[4px]">{row.ColumnF}</div>
                    </div>

                    {/* Fourth Black Box */}
                    <div className="bg-[#000000cf] w-[180px] h-[63px] flex justify-center items-center">
                      <div className="text-white text-[58px] relative top-[5px]">
                        {row.ColumnE}
                      </div>
                    </div>

                    {/* Fifth Red Box */}
                    <div
                      style={{
                        backgroundColor: `${data2[5].ColumnB}`,
                      }}
                      className="bg-red-800 text-white w-[180px] h-[63px] text-[58px] flex justify-center items-center"
                    >
                      <div className="relative top-[5px]">{row.ColumnD}</div>
                    </div>

                    {/* Sixth Black Box */}
                    <div className="bg-[#000000cf] w-[180px] h-[63px] flex justify-center items-center">
                      <div className="text-white text-[58px] relative top-[5px]">
                        {row.ColumnC}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="bg-white w-[3px] h-[63px]"></div>
                  </motion.div>
                ))}
              </ul>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Overall;
