import "./App.css";
import Controller from "./Components/Controller/control";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DisplayControl from "./Components/Controller/DisplayControl";
import Lower from "./Components/lower/page";
import OverallStats from "./Components/LiveStats/OverAllStats";
import Overall from "./Components/OverallData/Page";
import Slotlist from "./Components/Slotlist/page";

import Schedule from "./Components/MatchData/Schedule/Schedule";
import PlayingTeams from "./Components/Slotlist/playingTeam";
import Alerts from "./Components/Alerts/Alerts";
import Dom from "./Components/Alerts/Dom";

import UpperStats from "./Components/Alerts/UpperStats";
import Map from "./Components/Slotlist/MapInfo";

function App() {
  return (
    <BrowserRouter>
      <div className="w-[1920px] h-[1080px]">
        <Comps />
      </div>
    </BrowserRouter>
  );
}

function Comps() {
  return (
    <Routes>
      <Route path="/UpperStats" element={<UpperStats />} />
      <Route path="/OverallStats" element={<OverallStats />} />
      <Route path="/Overall" element={<Overall />} />
      <Route path="/Map" element={<Map />} />
      <Route path="/Dom" element={<Dom />} />
      <Route path="/Alerts" element={<Alerts />} />
      <Route path="/Playingteams" element={<PlayingTeams />} />
      <Route path="/Schedule" element={<Schedule />} />
      <Route path="/Result" element={<Controller />} />
      <Route path="/lower" element={<Lower />} />
      <Route path="/LiveStats" element={<DisplayControl />} />

      <Route path="/slotlist" element={<Slotlist />} />
    </Routes>
  );
}

export default App;
