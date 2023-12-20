import React, { useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../shared/constants";

const handleLogin = async (email: string, password: string) => {
  if (!email || !password) {
    alert("Please fill in both email and password to login.");
    return;
  } else {
    try {
      if (!email || !password) return;
      const response = await fetch("http://localhost:5000/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        localStorage.setItem("token", token);
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLoginBtnClick = async () => {
    await handleLogin(email, password);
    if (email && password) {
      navigate(RoutePaths.HomePage);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="loginButton" onClick={handleLoginBtnClick}>
          Login
        </button>
        <p className="register-text">
          Don't have an account? <a href="/Register">Click here</a>
        </p>{" "}
      </div>
    </div>
  );
}

export default LoginPage;
