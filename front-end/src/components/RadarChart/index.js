import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title
);

const RadarChart = ({ chartData }) => {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return <p>No data available to display the chart.</p>;
  }

  const { xAxis, yAxis, data, chartName, description } = chartData;

  const labels = data.map((item) => item[xAxis]);
  const values = data.map((item) => item[yAxis]);

  const generateColor = () => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;

    return `rgba(${r}, ${g}, ${b}, 0.7)`;
  };

  const color = generateColor();
  const borderColor = color.replace("0.7", "1");

  const chartConfig = {
    labels,
    datasets: [
      {
        label: yAxis,
        data: values,
        backgroundColor: color,
        borderColor,
        borderWidth: 2,
        pointBackgroundColor: borderColor,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: chartName,
        font: {
          size: 20,
        },
        color: "#111",
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <>
      <Radar data={chartConfig} options={chartOptions} />
      {description && <p>{description}</p>}
    </>
  );
};

export default RadarChart;
