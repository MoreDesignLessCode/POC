import React from "react";
import Jumbotron from "../components/Jumbotron";
import Cards from "../components/Cards";
import Overview from "../components/Overview";
import GetStarted from "../components/GetStarted";

export default function Home() {
  return (
    <div className="main-content home">
      <Jumbotron />
      <Cards />
      <Overview />
      <GetStarted />
    </div>
  );
}
