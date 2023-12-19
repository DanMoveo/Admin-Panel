import React, { useState } from "react";
import "./RegisterPage.scss";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../shared/constants";

const handleRegister = async (
  name: string,
  email: string,
  password: string
) => {
  if (!email || !password || !name) {
    alert("Please fill in name, email and password to register.");
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/admins/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email: email, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;

      localStorage.setItem("token", token);
    } else {
      console.error("Registration failed");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegisterBtnClick = async () => {
    await handleRegister(name, email, password);
    if (email && password && name) {
      navigate(RoutePaths.HomePage);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form">
        <h2>Register</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <button onClick={handleRegisterBtnClick}>Register</button>
      </div>
    </div>
  );
}

export default LoginPage;
