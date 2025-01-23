import React from 'react'
import Leaderboard from './../../components/Leaderboard/Leaderboard';
import NewsBlock from '../../components/NewsBlock/NewsBlock';

function MainPages() {
  const newsData = [
    {
      title: 'Вильярреал разгромил Реал Мадрид со счетом 8:0!',
      description: 'В невероятном матче за Кубок Испании Вильярреал одержал разгромную победу над Реал Мадридом со счетом 8:0. Симон Макиенок и Рауль Хименес стали главными героями встречи, оформив по четыре гола каждый. Макиенок украсил вечер эффектным голом через себя, а Хименес уверенно завершал атаки команды. Этот матч стал настоящим праздником для болельщиков и вошел в историю клуба.',
      backgroundImage: '/image/fooo.png',
      images: [
        '/image/mmm.jpg'
      ],
    }
  ];
  
  return (
    <div>
        <div>
          <h2>Новости</h2>
          {newsData.map((news, index) => (
            <NewsBlock
              key={index}
              title={news.title}
              description={news.description}
              backgroundImage={news.backgroundImage}
              images={news.images}
            />
          ))}
        </div>
        <Leaderboard/>

    </div>
  )
}

export default MainPages