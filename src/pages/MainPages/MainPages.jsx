import React from 'react'
import Leaderboard from './../../components/Leaderboard/Leaderboard';
import NewsBlock from '../../components/NewsBlock/NewsBlock';
import cls from './MainPages.module.scss'
import Quiz from '../../components/MiniGames/Quiz/Quiz';
import PenaltyShoot from '../../components/MiniGames/PenaltyShoot/PenaltyShoot';
import FootballQuiz from '../../components/MiniGames/FootballQuiz/FootballQuiz';

function MainPages() {
  const newsData = [
    {
      title: 'Манчестер Юнайтед выиграл турнир, обыграв Атлетико 4:2!',
      description: 'В захватывающем финале Манчестер Юнайтед одержал победу над Атлетико со счетом 4:2, завоевав престижный трофей. Главным героем встречи стал Бруну Фернандеш, оформивший дубль и ассистировавший Маркусу Рашфорду. Атлетико пытался переломить ход матча, но защита "красных дьяволов" выдержала натиск. Эта победа стала исторической для клуба и его болельщиков!',
      backgroundImage: '/image/fooo.png',
      images: [
      ],
    },
    {
      title: 'Лига готовит захватывающие противостояния!',
      description: 'Футбольный мир замер в ожидании топ-противостояний! В ближайших матчах нас ждут жаркие битвы: Лацио против Бенфики, Барселона против Реала Мадрид, Арсенал против Челси, Милан против Наполи. Эти матчи обещают быть наполнены драмой, эмоциями и великолепным футболом. Поклонники ждут зрелищных голов и напряженной борьбы!',
      backgroundImage: '/image/big_matches.png',
      images: [
      ],
    }
  ];
  
  return (
    <div className={cls.con}>
        <div>
          <Quiz/>
          {/* <FootballQuiz/> */}
          {/* <h2>Новости</h2>
          {newsData.map((news, index) => (
            <NewsBlock
              key={index}
              title={news.title}
              description={news.description}
              backgroundImage={news.backgroundImage}
              images={news.images}
            />
          ))} */}
        </div>
        <Leaderboard/>

    </div>
  )
}

export default MainPages