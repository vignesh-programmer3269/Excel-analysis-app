import { Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exct path="login" element={<Login />} />
        <ProtectedRoute path="dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
