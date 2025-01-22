import React from 'react';
import cls from './NewsBlock.module.scss';

function NewsBlock({ title, description, backgroundImage, images }) {
  return (
    <div className={cls.newsBlock} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className={cls.content}>
      <img className={cls.icon} src='/image/s1.png' alt="" />

        <h3 className={cls.title}>{title}</h3>
        <p className={cls.text}>{description}</p>
        <div className={cls.images}>
          {images.map((image, index) => (
            <img key={index} src={image} alt={`news-image-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsBlock;