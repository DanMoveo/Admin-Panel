import React from "react";
import { useNavigate } from "react-router-dom";
import { RoutePaths } from "../../shared/constants";


const SignOutButton: React.FC = () => {
    const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate(RoutePaths.Login);
  };

  return <button className="signOut" onClick={handleSignOut}>Sign Out</button>;
};

export default SignOutButton;
