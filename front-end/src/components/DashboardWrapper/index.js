import { useNavigate } from "react-router-dom";
import Dashboard from "../Dashboard";

const DashboardWrapper = () => {
  const navigate = useNavigate();
  return <Dashboard navigate={navigate} />;
};

export default DashboardWrapper;
