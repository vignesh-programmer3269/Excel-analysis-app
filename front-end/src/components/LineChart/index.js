import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData }) => {
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
        fill: false,
        borderColor: color,
        backgroundColor: borderColor,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
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
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <>
      <Line data={chartConfig} options={chartOptions} />
      {description && <p>{description}</p>}
    </>
  );
};

export default LineChart;
