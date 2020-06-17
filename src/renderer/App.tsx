import React from "react";
import Dashboard from "./components/Dashboard";
import { hot } from "react-hot-loader/root";
import RealMDashboard from "./components/RealMDashboard";

function App() {
  // return <Dashboard />;
  return <RealMDashboard />;
}

export default hot(App);
