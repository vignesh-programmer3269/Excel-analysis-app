import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      Cookies.set("jwt_token", data.token, { expires: 7 });
      setEmail("");
      setPassword("");
      setError(null);

      navigate("/", { replace: true });
    } catch (error) {
      this.setState({ error: error.message });
    }
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
    setError(null);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  const onClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-container">
      <img src="/logo/chart_ease_logo.png" alt="Logo" className="login-logo" />
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <label id="email" htmlFor="email">
          Email
        </label>
        <input
          type="text"
          id="email"
          placeholder="Enter Your Email"
          onChange={onChangeEmail}
          value={email}
        />
        <label id="password" htmlFor="password">
          Password
        </label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Enter Your Password"
          onChange={onChangePassword}
          value={password}
        />
        <div>
          <input
            type="checkbox"
            id="show-password"
            onChange={onClickShowPassword}
          />
          <label htmlFor="show-password">Show Password</label>
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Login;
