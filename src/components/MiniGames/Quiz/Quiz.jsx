import React, { useState, useEffect } from "react";
import cls from "./Quiz.module.scss";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5); // Начальное время для секундомера (5 секунд)
  const [timerActive, setTimerActive] = useState(false);

  // Прозвища в зависимости от результата
  const nicknames = [
    {
      range: [0, 5],
      nicknames: [
        "Новичок", "Начинающий", "Любитель", "Начинающий игрок", "Зеленый новичок",
        "Без опыта", "Начальный уровень", "Стартапер", "Новичок на поле", "Начальный мастер"
      ]
    },
    {
      range: [6, 10],
      nicknames: [
        "Любитель", "Полу-игрок", "Тренирующийся", "Среднячок", "На старте",
        "Любитель футбола", "Уже что-то умею", "Почти профессионал", "Независимый игрок", "Опытный новичок"
      ]
    },
    {
      range: [11, 13],
      nicknames: [
        "Эксперт", "Профессионал", "Футбольный стратег", "Знаток игры", "Влиятельный игрок",
        "Топ-игрок", "Тактик", "Умелый игрок", "Почти чемпион", "Легенда игры"
      ]
    },
    {
      range: [14, 15],
      nicknames: [
        "Мастер футбола", "Чемпион", "Гений на поле", "Легенда футбола", "Игровой монстр",
        "Король поля", "Тренер будущего", "Футбольная звезда", "Магистр игры", "Футбольный император"
      ]
    }
  ];

  // Функция для выбора случайного прозвища из подходящего диапазона
  const getNickname = (score) => {
    for (let nicknameRange of nicknames) {
      if (score >= nicknameRange.range[0] && score <= nicknameRange.range[1]) {
        // Случайный выбор из массива прозвищ
        const randomIndex = Math.floor(Math.random() * nicknameRange.nicknames.length);
        return nicknameRange.nicknames[randomIndex];
      }
    }
    return "Неизвестный гений"; // Если вдруг баллы не попадают в ни одну категорию
  };

  // Загружаем вопросы при старте компонента
  useEffect(() => {
    fetch('/quiz.json')  // Указываем путь к JSON
      .then(response => response.json())
      .then(data => {
        if (data?.questions) {
          // Перемешиваем вопросы и их ответы один раз
          const shuffledQuestions = getRandomQuestions(data.questions, 15);
          const shuffledQuestionsWithAnswers = shuffledQuestions.map(question => ({
            ...question,
            options: shuffleAnswers(question.options)
          }));
          setQuestions(shuffledQuestionsWithAnswers);
        }
      })
      .catch(error => console.error('Ошибка при загрузке вопросов:', error));
  }, []);

  const getRandomQuestions = (allQuestions, num) => {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
  };

  // Функция для перемешивания массива ответов
  const shuffleAnswers = (answers) => {
    const shuffledAnswers = [...answers];
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }
    return shuffledAnswers;
  };

  // Функция для обработки ответа
  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(5); // Сбрасываем время при переходе к следующему вопросу
      } else {
        setQuizFinished(true);
      }
    }, 800);
  };

  // Функция для старта викторины
  const startQuiz = () => {
    setQuizStarted(true);
    setTimerActive(true); // Активируем таймер при старте викторины
    setScore(0); // Сбрасываем счет при новом начале викторины
    setCurrentQuestion(0); // Сбрасываем вопрос при новом начале
    setQuizFinished(false); // Сбрасываем статус завершенности викторины
    setTimeLeft(5); // Устанавливаем таймер на 5 секунд
  };

  // Запускаем таймер
  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0 && !quizFinished) {
      // Если таймер активен и время больше 0, обновляем каждую секунду
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Если время вышло, переходим к следующему вопросу
      setTimeLeft(5); // Сбрасываем таймер
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setQuizFinished(true);
      }
    }

    // Очистка таймера при размонтировании компонента или при изменении времени
    return () => clearInterval(timer);

  }, [timeLeft, timerActive, currentQuestion, quizFinished, questions.length]);

  return (
    <div className={cls.quizContainer}>
      {!quizStarted ? (
        <div className={cls.startScreen}>
          <h2 className={cls.title}>Проверь свои знания по футболу</h2>
          <button onClick={startQuiz} className={cls.startButton}>Начать викторину</button>
        </div>
      ) : !quizFinished ? (
        <div className={cls.quizBox}>
          <h2>{questions[currentQuestion]?.question}</h2>
          <div className={cls.options}>
            {questions[currentQuestion]?.options.map((option, index) => (
              <button key={index} className={cls.option} onClick={() => handleAnswer(index)}>
                {option}
              </button>
            ))}
          </div>
          <p>Вопрос {currentQuestion + 1} из {questions.length}</p>
          <p>Время: {timeLeft} секунд</p>
        </div>
      ) : (
        <div className={cls.resultBox}>
          <h2>Тест завершен!</h2>
          <p>Ваш результат: {score} из {questions.length} правильных ответов.</p>
          <p>Ваше прозвище: <strong>{getNickname(score)}</strong></p>
          <button onClick={startQuiz} className={cls.retry}>Пройти снова</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
