import { useParams, useNavigate } from "react-router-dom";
import CreateChart from "../CreateChart";

const CreateChartWrapper = () => {
  const { fileId } = useParams();
  const navigate = useNavigate();
  return <CreateChart fileId={fileId} navigate={navigate} />;
};

export default CreateChartWrapper;
