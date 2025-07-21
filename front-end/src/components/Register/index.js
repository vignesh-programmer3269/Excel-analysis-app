import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import "./index.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Registration failed");
      }

      const data = await response.json();

      Cookies.set("jwt_token", data.token, { expires: 7 });
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);

      navigate("/", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  const onChangeName = (event) => {
    setName(event.target.value);
    setError(null);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
    setError(null);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  const onChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    setError(null);
  };

  const onClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Register</h1>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Enter Your Name"
          onChange={onChangeName}
          value={name}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={onChangeEmail}
        />
        <label htmlFor="password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="Enter Your Password"
          value={password}
          onChange={onChangePassword}
        />
        <label htmlFor="confirm-password">Confirm Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="confirm-password"
          placeholder="Confirm Your Password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
        />
        <div>
          <input
            type="checkbox"
            id="show-password"
            onClick={onClickShowPassword}
          />
          <label htmlFor="show-password">Show Password</label>
        </div>
        <button type="submit">Register</button>
        {error && <p className="error-message">{error}</p>}
        <p>
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </form>
      <img
        src="/logo/chart_ease_logo.png"
        alt="Logo"
        className="register-logo"
      />
    </div>
  );
};

export default Register;
