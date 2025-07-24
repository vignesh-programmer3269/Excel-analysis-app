import { Component } from "react";

import API from "../../api.js";
import Header from "../Header";

import "./index.css";

class CreateChart extends Component {
  state = {
    fileData: [],
    fileMetaData: {},
    chartName: "",
    xAxis: "",
    yAxis: "",
    chartType: "",
    description: "",
  };

  componentDidMount() {
    this.getFileData();
  }

  getFileData = async () => {
    try {
      const fileId = this.props.fileId;

      const response = await API.get(`/upload/file/${fileId}`);
      const data = response.data;

      this.setState({
        fileData: [...data.file.data],
        fileMetaData: data,
      });
    } catch (error) {
      alert(error.response.data.message);
      const navigate = this.props.navigate;
      navigate("/");
    }
  };

  onChangeChartName = (event) => {
    this.setState({ chartName: event.target.value });
  };

  onChangeChartType = (event) => {
    this.setState({ chartType: event.target.value });
  };

  onChangeXAxis = (event) => {
    this.setState({ xAxis: event.target.value });
  };

  onChangeYAxis = (event) => {
    this.setState({ yAxis: event.target.value });
  };

  onChangeChartDescription = (event) => {
    this.setState({ description: event.target.value });
  };

  getAxisOptions = () => {
    const { fileData } = this.state;

    if (!fileData || fileData.length === 0) {
      return null;
    }

    return Object.keys(fileData[0]).map((key, i) => (
      <option key={i} value={key}>
        {key}
      </option>
    ));
  };

  getTableHeaders = () => {
    const { fileData } = this.state;

    if (!fileData || fileData.length === 0) {
      return null;
    }

    return Object.keys(fileData[0]).map((key, i) => <th key={i}>{key}</th>);
  };

  getTableData = () => {
    const { fileData } = this.state;

    return fileData.map((row, i) => (
      <tr key={i}>
        {Object.values(row).map((value, i) => (
          <td key={i}>{value}</td>
        ))}
      </tr>
    ));
  };

  handleCreateChartSubmit = async (event) => {
    event.preventDefault();

    try {
      const {
        fileData,
        fileMetaData,
        chartName,
        xAxis,
        yAxis,
        chartType,
        description,
      } = this.state;
      const { fileName, originalFileName, sheetName, mimeType, fileSize } =
        fileMetaData;
      const { fileId } = this.props;

      const requestBody = {
        fileName,
        originalFileName,
        fileId,
        sheetName,
        mimeType,
        fileSize,
        chartName,
        xAxis,
        yAxis,
        chartType,
        description: description.trim(),
        data: fileData,
      };

      const response = await API.post("/upload/chart", requestBody);

      if (response.status === 200) {
        const navigate = this.props.navigate;
        const chartId = response.data.chart._id;

        navigate(`/chart/${chartId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const {
      fileData,
      fileMetaData,
      chartName,
      xAxis,
      yAxis,
      chartType,
      description,
    } = this.state;

    return (
      <div className="create-chart-page">
        <Header />
        <div className="create-chart-container">
          <form
            className="create-chart-form"
            onSubmit={this.handleCreateChartSubmit}
          >
            <h1>Create Chart</h1>
            <label htmlFor="ChartName">Chart Name</label>
            <input
              type="text"
              id="ChartName"
              placeholder="Enter the chart name"
              value={chartName}
              onChange={this.onChangeChartName}
              required
            />
            <label htmlFor="xAxis">X Axis</label>
            <select
              name="x axis"
              id="xAxis"
              value={xAxis}
              onChange={this.onChangeXAxis}
              required
            >
              <option value="" disabled hidden>
                Select the X axis
              </option>
              {this.getAxisOptions()}
            </select>
            <label htmlFor="yAxis">Y Axis</label>
            <select
              name="y axis"
              id="yAxis"
              value={yAxis}
              onChange={this.onChangeYAxis}
              required
            >
              <option value="" disabled hidden>
                Select the Y axis
              </option>
              {this.getAxisOptions()}
            </select>
            <label htmlFor="ChartType">Chart Type</label>
            <select
              name="chart type"
              id="ChartType"
              value={chartType}
              onChange={this.onChangeChartType}
              required
            >
              <option value="" disabled hidden>
                Select the chart type
              </option>
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="doughnut">Doughnut Chart</option>
              <option value="radar">Radar Chart</option>
            </select>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="Description"
              placeholder="Take notes..."
              value={description}
              onChange={this.onChangeChartDescription}
              maxLength={150}
            />
            <button type="submit">Create Chart</button>
          </form>
          <div className="preview-table-container">
            <h1>Table Preview</h1>
            <table className="preview-table">
              <thead>
                <tr>{this.getTableHeaders()}</tr>
              </thead>
              <tbody>{this.getTableData()}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateChart;
