import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pages/HomePage/HomePage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import { RoutePaths } from "./shared/constants";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={RoutePaths.Login} element={<LoginPage />} />
        <Route path={RoutePaths.Register} element={<RegisterPage />} />
        <Route path={RoutePaths.HomePage} element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
