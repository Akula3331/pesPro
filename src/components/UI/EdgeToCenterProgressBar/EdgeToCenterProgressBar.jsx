import React, { useEffect, useState } from "react";
import cls from "./EdgeToCenterProgressBar.module.scss";

const EdgeToCenterProgressBar = ({
  value1,
  value2,
  winsHigherBetter = true,
  label,
  index
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  const total = value1 + value2;
  const leftPercent =
    total === 0 ? 50 : (value1 / (value1 + value2)) * 100;
  const rightPercent = 100 - leftPercent;

  const leftWins = winsHigherBetter ? value1 > value2 : value1 < value2;
  const rightWins = winsHigherBetter ? value2 > value1 : value2 < value1;

  return (
    <div className={`${cls.barWrapper} ${visible ? cls.active : ""}`}>
      <div className={cls.label}>{label}</div>
      <div className={cls.bar}>
        <div
          className={`${cls.fillLeft} ${leftWins ? cls.positive : ""}`}
          style={{ width: `${leftPercent}%` }}
        >
          <span className={cls.barValueLeft}>{value1}</span>
        </div>
        <div
          className={`${cls.fillRight} ${rightWins ? cls.positive : ""}`}
          style={{ width: `${rightPercent}%` }}
        >
          <span className={cls.barValueRight}>{value2}</span>
        </div>
      </div>
    </div>
  );
};

export default EdgeToCenterProgressBar;
