import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout"; // ✅ ADD THIS

import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Reports from "./pages/Reports";
import IssuePage from "./pages/IssuePage";
import Stock from "./pages/Stock";

function App() {
  return (
    <Router>
      <Layout> {/* ✅ WRAP EVERYTHING */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/issue" element={<IssuePage />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;