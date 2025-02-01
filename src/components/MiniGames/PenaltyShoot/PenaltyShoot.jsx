import React, { useState, useEffect, useRef } from "react";
import cls from "./PenaltyShoot.module.scss";

// Список футбольных загадок
const riddles = [
    {
      question: "Что за футбольный клуб часто называют 'Барса'?",
      options: ["Милан", "Реал Мадрид", "Барселона", "Челси"],
      answer: 2, // Индекс правильного ответа
    },
    {
      question: "Кто является самым известным футболистом Бразилии?",
      options: ["Пеле", "Роналду", "Неймар", "Месси"],
      answer: 0,
    },
    {
      question: "Какая команда выиграла Лигу Чемпионов в 2020 году?",
      options: ["Ливерпуль", "Бавария", "Барселона", "Манчестер Сити"],
      answer: 1,
    },
    {
      question: "Как называется знаменитая футбольная школа в Барселоне?",
      options: ["Милан", "Академия Месси", "Ла Масия", "Тоттенхэм"],
      answer: 2,
    },
  ];
const PenaltyShoot = () => {
    const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
  
    // Обработка ответа
    const handleAnswer = (index) => {
      setUserAnswer(index);
      setIsAnswered(true);
      if (index === riddles[currentRiddleIndex].answer) {
        setScore(score + 1);
      }
    };
  
    // Переход к следующей загадке
    const goToNextRiddle = () => {
      if (currentRiddleIndex + 1 < riddles.length) {
        setCurrentRiddleIndex(currentRiddleIndex + 1);
        setUserAnswer(null);
        setIsAnswered(false);
      } else {
        alert(`Вы ответили правильно на ${score} из ${riddles.length} загадок!`);
      }
    };
  
    return (
      <div className={cls.container}>
        <h2>Футбольные загадки</h2>
        <div className={cls.riddleBox}>
          <h3>{riddles[currentRiddleIndex].question}</h3>
          <div className={cls.options}>
            {riddles[currentRiddleIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`${cls.option} ${userAnswer !== null ? (index === riddles[currentRiddleIndex].answer ? cls.correct : cls.wrong) : ""}`}
                disabled={isAnswered}
              >
                {option}
              </button>
            ))}
          </div>
          {isAnswered && (
            <div className={cls.feedback}>
              {userAnswer === riddles[currentRiddleIndex].answer ? (
                <p className={cls.correctAnswer}>Правильный ответ!</p>
              ) : (
                <p className={cls.incorrectAnswer}>
                  Неправильный ответ! Правильный:{" "}
                  {riddles[currentRiddleIndex].options[riddles[currentRiddleIndex].answer]}
                </p>
              )}
              <button onClick={goToNextRiddle} className={cls.nextButton}>
                Следующий вопрос
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
export default PenaltyShoot;
