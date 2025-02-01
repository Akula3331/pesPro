import React, { useState, useEffect } from "react";
import cls from "./ClickTheBall.module.scss";

const ClickTheBall = () => {
  const [ballPosition, setBallPosition] = useState({ top: 0, left: 0 });
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0); // Количество промахов
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (gameOver) return;

    // Позиционируем мяч случайным образом
    const ballInterval = setInterval(() => {
      const top = Math.floor(Math.random() * 80); // Позиция мяча по вертикали
      const left = Math.floor(Math.random() * 80); // Позиция мяча по горизонтали
      setBallPosition({ top, left });
    }, 1000); // Каждую секунду мяч появляется в новом месте

    // Очистка интервала
    return () => clearInterval(ballInterval);
  }, [gameOver]);

  // Обработчик клика по мячу
  const handleClickBall = () => {
    if (gameOver) return;

    setScore(score + 1); // Увеличиваем счет
  };

  // Обработчик промаха
  const handleMiss = () => {
    if (gameOver) return;

    setMisses(misses + 1); // Увеличиваем счетчик промахов

    if (misses + 1 === 3) {
      setGameOver(true); // Завершаем игру, если 3 промаха
    }
  };

  // Завершаем игру через 20 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameOver(true);
    }, 20000); // Игра длится 20 секунд

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cls.gameContainer}>
      <h2>Кликни по мячу!</h2>
      <p>Очки: {score}</p>
      <p>Промахи: {misses} из 3</p>

      <div
        className={cls.gameField}
        style={{
          height: "300px",
          width: "100%",
          backgroundColor: "#f1f1f1",
          position: "relative",
          border: "2px solid #000",
        }}
        onClick={handleMiss} // Обработчик клика по пустому полю (промах)
      >
        {!gameOver ? (
          <div
            className={cls.ball}
            onClick={(e) => {
              e.stopPropagation(); // Чтобы клик по мячу не сработал как промах
              handleClickBall();
            }}
            style={{
              position: "absolute",
              top: `${ballPosition.top}%`,
              left: `${ballPosition.left}%`,
              width: "30px",
              height: "30px",
              backgroundColor: "#66bb6a",
              borderRadius: "50%",
              cursor: "pointer",
            }}
          ></div>
        ) : (
          <div className={cls.gameOver}>
            <h3>Игра окончена!</h3>
            <p>Ваш результат: {score}</p>
            <p>Промахов: {misses}</p>
            <button onClick={() => window.location.reload()} className={cls.retryButton}>
              Попробовать снова
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickTheBall;
