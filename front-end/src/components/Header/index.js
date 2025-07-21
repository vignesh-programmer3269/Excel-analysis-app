import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

import { MdUploadFile } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";

import "./index.css";

const Header = () => {
  const navigate = useNavigate();

  const onClickUploadBtn = () => {
    navigate("/upload");
  };

  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="header-container">
      <Link to="/">
        <img
          src="/logo/chart_ease_logo.png"
          alt="ChartEase Logo"
          className="header-logo"
        />
      </Link>
      <div>
        <button className="upload-file-btn" onClick={onClickUploadBtn}>
          Upload File <MdUploadFile className="upload-icon" />
        </button>
        <CgProfile className="profile-icon" />
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Header;
