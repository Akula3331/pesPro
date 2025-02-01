import React, { useState } from "react";
import cls from "./FootballQuiz.module.scss"; // Можно использовать свой файл стилей

const players = [
  { name: "Неймар", position: "Атакующий", clubs: ["Барселона", "ПСЖ", "Сантос"] },
  { name: "Криштиану", position: "Атакующий", clubs: ["Реал Мадрид", "Ювентус", "Манчестер Юнайтед"] },
  { name: "Петр", position: "Вратарь", clubs: ["Арсенал", "Челси", "Манчестер Сити"] },
  { name: "Луис", position: "Полузащитник", clubs: ["Барселона", "Интер", "ПСЖ"] },
  // Добавить больше игроков...
];

const FootballQuiz = () => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSubmit = () => {
    if (userAnswer.toLowerCase() === players[currentPlayerIndex].name.toLowerCase()) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(() => {
        if (currentPlayerIndex + 1 < players.length) {
          setCurrentPlayerIndex(currentPlayerIndex + 1);
          setUserAnswer("");
          setIsCorrect(null);
        } else {
          setQuizFinished(true);
        }
      }, 1000);
    } else {
      setIsCorrect(false); // Если ответ неправильный, не переходим к следующему вопросу
    }
  };

  return (
    <div className={cls.quizContainer}>
      {!quizFinished ? (
        <div className={cls.quizBox}>
          <h2 className={cls.question}>
            Кто это? Клубы: {players[currentPlayerIndex].clubs.join(", ")}
          </h2>
          {isCorrect === false && (
            <p className={cls.position}>Подсказка: Позиция - {players[currentPlayerIndex].position}</p>
          )}
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            className={cls.input}
            placeholder="Введите имя футболиста"
          />
          <button onClick={handleSubmit} className={cls.submitButton}>Ответить</button>

          {isCorrect !== null && (
            <p className={cls.result}>
              {isCorrect ? "Правильно!" : "Неправильно! Попробуйте снова."}
            </p>
          )}
        </div>
      ) : (
        <div className={cls.resultBox}>
          <h2>Игра завершена!</h2>
          <p>
            Ваш результат: <strong>{score}</strong> правильных ответов.
          </p>
          <button onClick={() => window.location.reload()} className={cls.retry}>
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  );
};

export default FootballQuiz;
