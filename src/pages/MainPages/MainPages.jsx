import React from 'react'
import Leaderboard from './../../components/Leaderboard/Leaderboard';
import NewsBlock from '../../components/NewsBlock/NewsBlock';

function MainPages() {
  const newsData = [
    {
      title: 'ПСЖ выигрывает Кубок Франции!',
      description: 'Пари Сен-Жермен разгромил Парижский ФК со счетом 4:0 в финале Кубка Франции. PSG dominировал на поле с самого начала, забив три гола в первом тайме и один во втором, обеспечив убедительную победу.',
      backgroundImage: '/image/wwww.png',
      images: [
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