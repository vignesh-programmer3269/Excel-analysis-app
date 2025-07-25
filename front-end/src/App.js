import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import DashboardWrapper from "./components/DashboardWrapper";
import Upload from "./components/Upload";
import CreateChartWrapper from "./components/CreateChartWrapper";
import ViewChart from "./components/ViewChart";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="/upload" element={<Upload />} />
          <Route
            path="/create-chart/:fileId"
            element={<CreateChartWrapper />}
          />
          <Route path="/chart/:chartId" element={<ViewChart />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
