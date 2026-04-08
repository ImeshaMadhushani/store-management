import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Reports from "./pages/Reports";
import IssuePage from "./pages/IssuePage";
import Stock from "./pages/Stock";

function App() {
  return (
    <Router>
      <Navbar />

      <div className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;