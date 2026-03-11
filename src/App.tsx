import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import CurrentVehicles from "./pages/CurrentVehicles/CurrentVehicles.tsx";
import RecentActivity from "./pages/RecentActivity/RecentActivity.tsx";
import PlateLookup from "./pages/PlateLookup/PlateLookup.tsx";
import Permits from "./pages/Permits/Permits.tsx";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/current" element={<CurrentVehicles />} />
        <Route path="/activity" element={<RecentActivity />} />
        <Route path="/lookup" element={<PlateLookup />} />
        <Route path="/permits" element={<Permits />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
