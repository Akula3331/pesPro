import React, { useEffect, useState } from "react";
import cls from "./MainPages.module.scss";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import Quiz from "../../components/MiniGames/Quiz/Quiz";

function MainPages() {
  return (
    <div className={cls.con}>
      <Quiz />
      <Leaderboard />
    </div>
  );
}

export default MainPages;
