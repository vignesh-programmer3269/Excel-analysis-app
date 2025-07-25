import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import Header from "../Header";
import { MdDelete } from "react-icons/md";
import { LuView } from "react-icons/lu";
import { MdAddChart } from "react-icons/md";
import "./index.css";

import API from "../../api";

class Dashboard extends Component {
  state = {
    files: [],
    charts: [],
  };

  componentDidMount() {
    this.getFilesCount();
    this.getChartsCount();
  }

  getFilesCount = async () => {
    try {
      const response = await API.get("/upload/files");

      const data = response.data;
      this.setState({ files: data.files });
    } catch (error) {
      console.error("Error fetching files count:", error);
    }
  };

  getChartsCount = async () => {
    try {
      const response = await API.get("/upload/charts");

      const data = response.data;
      this.setState({ charts: data.charts });
    } catch (error) {
      console.error("Error fetching charts count:", error);
    }
  };

  onClickCreateChartBtn = (chartId) => {
    const { navigate } = this.props;
    navigate(`/create-chart/${chartId}`);
  };

  onClickViewChartBtn = (chartId) => {
    const { navigate } = this.props;
    navigate(`/chart/${chartId}`);
  };

  onClickDeleteFileBtn = async (fileId) => {
    try {
      const response = await API.delete(`/upload/delete/file/${fileId}`);

      this.setState((prevState) => {
        const newList = prevState.files.filter((file) => file._id !== fileId);
        return { files: newList };
      });
      alert(response.data.message);
    } catch (error) {
      alert("File not found. Please refresh the page and try again.");
    }
  };

  onClickDeleteChartBtn = async (chartId) => {
    try {
      const response = await API.delete(`/upload/delete/chart/${chartId}`);

      this.setState((prevState) => {
        const newList = prevState.charts.filter(
          (chart) => chart._id !== chartId
        );
        return { charts: newList };
      });
      alert(response.data.message);
    } catch (error) {
      alert("Chart not found. Please refresh the page and try again.");
    }
  };

  generateFilesList = () => {
    const { files } = this.state;

    return (
      <>
        <li className="file-header">
          <p>File Name</p>
          <p>File Size</p>
          <p>Uploaded At</p>
        </li>
        {files.map((file) => (
          <li key={file._id} className="file-item">
            <p>{file.originalFileName}</p>
            <p>{(file.fileSize / 1024).toFixed(2)} KB</p>
            <p>{new Date(file.uploadedAt).toLocaleString()}</p>
            <button
              type="button"
              className="create-chart-btn"
              title="Create chart"
              onClick={() => {
                this.onClickCreateChartBtn(file._id);
              }}
            >
              <MdAddChart />
            </button>
            <button
              type="button"
              className="delete-btn"
              title="Delete file"
              onClick={() => {
                this.onClickDeleteFileBtn(file._id);
              }}
            >
              <MdDelete />
            </button>
          </li>
        ))}
      </>
    );
  };

  generateChartsList = () => {
    const { charts } = this.state;

    return (
      <>
        <li className="chart-header">
          <p>Chart Name</p>
          <p>Chart Type</p>
          <p>Description</p>
          <p>Created At</p>
        </li>
        {charts.map((chart) => (
          <li key={chart._id} className="chart-item">
            <p>{chart.chartName}</p>
            <p>{chart.chartType}</p>
            <p>{chart.description.length <= 0 ? "--" : chart.description}</p>
            <p>{new Date(chart.createdAt).toLocaleString()}</p>
            <button
              type="button"
              className="view-chart-btn"
              title="View chart"
              onClick={() => {
                this.onClickViewChartBtn(chart._id);
              }}
            >
              <LuView />
            </button>
            <button
              type="button"
              className="delete-btn"
              title="Delete chart"
              onClick={() => {
                this.onClickDeleteChartBtn(chart._id);
              }}
            >
              <MdDelete />
            </button>
          </li>
        ))}
      </>
    );
  };

  render() {
    const { files, charts } = this.state;

    return (
      <div className="dashboard-page">
        <Header />
        <div className="dashboard-container">
          <div className="file-chart-count">
            <div className="file-count">
              <h1>No of Files Uploaded</h1>
              <p>{files.length}</p>
            </div>
            <div className="chart-count">
              <h1>No of Charts Created</h1>
              <p>{charts.length}</p>
            </div>
          </div>

          <div className="files-container">
            <h1>Uploaded Files</h1>
            <ul type="none" className="files-list">
              {files.length === 0 ? (
                <p>No files uploaded yet.</p>
              ) : (
                this.generateFilesList()
              )}
            </ul>
          </div>

          <div className="charts-container">
            <h1>Created Charts</h1>
            <ul className="charts-list">
              {charts.length === 0 ? (
                <p>No charts created yet.</p>
              ) : (
                this.generateChartsList()
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
