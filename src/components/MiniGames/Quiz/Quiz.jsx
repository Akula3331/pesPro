import React, { useState, useEffect } from "react";
import cls from "./Quiz.module.scss";

const questions = [
  {
    question: "Какой клуб выиграл Лигу Чемпионов в 2005 году, несмотря на отставание 3:0 в первом тайме?",
    options: ["Милан", "Ливерпуль", "Барселона", "Челси"],
    correct: 1,
  },
  {
    question: "Какой футболист стал самым молодым автором гола на чемпионатах мира?",
    options: ["Пеле", "Мбаппе", "Роналдо", "Фернандо Торрес"],
    correct: 1,
  },
  {
    question: "Какая страна выигрывала чемпионат мира 2 раза подряд?",
    options: ["Германия", "Аргентина", "Бразилия", "Италия"],
    correct: 2,
  },
  {
    question: "Какой клуб является рекордсменом по числу титулов в Кубке Англии?",
    options: ["Манчестер Юнайтед", "Арсенал", "Челси", "Ливерпуль"],
    correct: 1,
  },
  {
    question: "Кто из игроков забил более 500 голов за свою карьеру в европейских клубах?",
    options: ["Лионель Месси", "Роналду", "Ференц Пушкаш", "Златан Ибрагимович"],
    correct: 3,
  },
  {
    question: "Какой футболист стал первым в истории, получившим Золотой мяч пять раз?",
    options: ["Роналду", "Месси", "Каннаваро", "Роналдиньо"],
    correct: 0,
  },
  {
    question: "Кто был главным тренером Франции, когда они выиграли чемпионат мира в 1998 году?",
    options: ["Лоран Блан", "Дидье Дешам", "Арсен Венгер", "Раймон Доменек"],
    correct: 1,
  },
  {
    question: "Кто является лучшим бомбардиром в истории Лиги Чемпионов?",
    options: ["Лионель Месси", "Роналду", "Роберт Левандовски", "Карим Бензема"],
    correct: 1,
  },
  {
    question: "Кто был первым футболистом, проданным за 100 миллионов евро?",
    options: ["Неймар", "Гарет Бэйл", "Криштиану Роналду", "Пол Погба"],
    correct: 3,
  },
  {
    question: "Какой игрок забил самый быстрый гол в истории чемпионатов мира?",
    options: ["Лука Модрич", "Хуан Хавьер", "Рой Макиннер", "Хасан Шахин"],
    correct: 2,
  },
  {
    question: "Какой игрок стал первым, кто выиграл 4 Лиги Чемпионов с разными клубами?",
    options: ["Златан Ибрагимович", "Роналду", "Кака", "Тьерри Анри"],
    correct: 0,
  },
  {
    question: "Кто был лучшим бомбардиром в истории чемпионатов мира по футболу на момент 2022 года?",
    options: ["Мирослав Клозе", "Роналду", "Роберт Левандовски", "Герд Мюллер"],
    correct: 0,
  },
  {
    question: "Какой футболист забил наибольшее количество голов на чемпионатах Европы?",
    options: ["Криштиану Роналду", "Альфредо Ди Стефано", "Мишель Платини", "Златан Ибрагимович"],
    correct: 0,
  },
  {
    question: "Какая страна выиграла Кубок Конфедераций в 2017 году?",
    options: ["Германия", "Чили", "Бразилия", "Мексика"],
    correct: 0,
  },
  {
    question: "Какой футболист был капитаном сборной Франции в финале ЧМ-2018?",
    options: ["Погба", "Мбаппе", "Гризманн", "Дидье Дешам"],
    correct: 3,
  }
];


const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Таймер на 5 секунд
  const [timerRunning, setTimerRunning] = useState(false); // Таймер не стартует сразу
  const [quizStarted, setQuizStarted] = useState(false); // Проверка на старт викторины

  // Генерация футбольного прозвища на основе результатов
  const generateNickname = () => {
    if (score <= 3) return "Неудачник";
    if (score <= 6) return "Новичок";
    if (score <= 8) return "Звезда";
    return "Легенда";
  };

  // Обработка выбора ответа
  const handleAnswer = (index) => {
    if (!timerRunning) return; // Если таймер не работает, не позволяем выбрать ответ
    setSelectedAnswer(index);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    } else {
      setScore(score);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setTimeLeft(3); // Сбрасываем таймер
        setTimerRunning(true); // Включаем таймер для следующего вопроса
      } else {
        setQuizFinished(true);
      }
    }, 800);
  };

  // Таймер для отсчета времени
  useEffect(() => {
    if (timeLeft > 0 && timerRunning) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      // Если время истекло, засчитываем ответ как неправильный
      setSelectedAnswer(null);
      setScore(score); // Баллы не меняются, но следующий вопрос
      setTimeout(() => {
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion(currentQuestion + 1);
          setTimeLeft(3); // Сбрасываем таймер
          setTimerRunning(true); // Включаем таймер для следующего вопроса
        } else {
          setQuizFinished(true);
        }
      }, 800);
    }
  }, [timeLeft, timerRunning, currentQuestion, score]);

  const startQuiz = () => {
    setQuizStarted(true); // Начинаем викторину
    setTimerRunning(true); // Включаем таймер сразу
  };

  return (
    <div className={cls.quizContainer}>
      {!quizStarted ? (
        <div className={cls.startScreen}>
          <h2 className={cls.title}>Проверь свои знания по футболу</h2>
          <button onClick={startQuiz} className={cls.startButton}>
            Начать викторину
          </button>
        </div>
      ) : !quizFinished ? (
        <div className={cls.quizBox}>
          <h2 className={cls.question}>{questions[currentQuestion].question}</h2>
          
          {/* Таймер */}
          <div className={cls.timer}>
            {timeLeft} секунд
          </div>

          <div className={cls.options}>
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`${cls.option} ${
                  selectedAnswer !== null
                    ? index === questions[currentQuestion].correct
                      ? cls.correct
                      : index === selectedAnswer
                      ? cls.wrong
                      : ""
                    : ""
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null || !timerRunning}
              >
                {option}
              </button>
            ))}
          </div>
          <p className={cls.progress}>
            Вопрос {currentQuestion + 1} из {questions.length}
          </p>
        </div>
      ) : (
        <div className={cls.resultBox}>
          <h2>Тест завершен!</h2>
          <p>
            Ваш результат: <strong>{((score / questions.length) * 100).toFixed(1)}%</strong>
          </p>
          <p>
            {score} из {questions.length} правильных ответов.
          </p>
          <p className={cls.nickname}>
            Ваш футбольный статус: <strong>{generateNickname()}</strong>
          </p>
          <button onClick={() => window.location.reload()} className={cls.retry}>
            Пройти снова
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
