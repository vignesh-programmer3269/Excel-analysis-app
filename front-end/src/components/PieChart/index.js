import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = ({ chartData }) => {
  if (!chartData || !chartData.data || chartData.data.length === 0) {
    return <p>No data available to display the chart.</p>;
  }

  const { xAxis, yAxis, data, chartName, description } = chartData;

  const labels = data.map((item) => item[xAxis]);
  const values = data.map((item) => item[yAxis]);

  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 156) + 100;
      const g = Math.floor(Math.random() * 156) + 100;
      const b = Math.floor(Math.random() * 156) + 100;
      colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
    }
    return colors;
  };

  const colors = generateColors(values.length);
  const borderColors = colors.map((c) => c.replace("0.7", "1"));

  const chartConfig = {
    labels,
    datasets: [
      {
        label: yAxis,
        data: values,
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 1,
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
        position: "bottom",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <>
      <Pie data={chartConfig} options={chartOptions} />
      {description && <p>{description}</p>}
    </>
  );
};

export default PieChart;
