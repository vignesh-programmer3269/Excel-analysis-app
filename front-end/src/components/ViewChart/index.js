import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import BarChart from "../BarChart";
import LineChart from "../LineChart";
import PieChart from "../PieChart";
import DoughnutChart from "../DoughnutChart";
import RadarChart from "../RadarChart";

import API from "../../api.js";
import Header from "../Header";

import "./index.css";

const ViewChart = () => {
  const [chartData, setChartData] = useState({});
  const { chartId } = useParams();

  useEffect(() => {
    getChartData();
  }, []);

  const getChartData = async () => {
    try {
      const response = await API.get(`/upload/chart/${chartId}`);
      setChartData(response.data.chart);
    } catch (error) {
      console.error(error);
    }
  };

  const getChart = () => {
    const { chartType } = chartData;

    switch (chartType) {
      case "bar":
        return <BarChart chartData={chartData} />;
      case "line":
        return <LineChart chartData={chartData} />;
      case "pie":
        return <PieChart chartData={chartData} />;
      case "doughnut":
        return <DoughnutChart chartData={chartData} />;
      case "radar":
        return <RadarChart chartData={chartData} />;
      default:
        return null;
    }
  };

  return (
    <div className="view-chart-page">
      <Header />
      <div className="view-chart-container">
        <div className="chart">{getChart()}</div>
      </div>
    </div>
  );
};

export default ViewChart;
