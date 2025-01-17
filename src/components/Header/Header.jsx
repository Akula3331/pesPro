import React from 'react'
import cls from './Header.module.scss'
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className={cls.container}>
        <div className={cls.con}>
        <Link className={cls.block} to='/'>
            <img className={cls.icons} src="/image/home.svg" alt="" />
            <p className={cls.text}>Главная</p>
        </Link>
        <Link className={cls.block} to="/teamList">
            <img className={cls.icons} src="/image/notepad.svg" alt="" />
            <p className={cls.text}>Команды</p>
        </Link>
        <Link className={cls.block} to='/tournament'>
            <img className={cls.icons} src="/image/trophy.svg" alt="" />
            <p className={cls.text}>Турниры</p>
        </Link>
        <Link className={cls.block} to="/history">
            <img className={cls.icons} src="/image/history.svg" alt="" />
            <p className={cls.text}>История</p>
        </Link>
        </div>
       
        <div className={cls.tourBlock}>
        <Link className={cls.block} to='/tourNow'>
            <img className={cls.icon} src="/image/league.svg" alt="" />
            <p className={cls.text}>Tournament</p>
        </Link>
        <Link className={cls.block} to='/league'>
            <img className={cls.icon} src="/image/kyrgyz.svg" alt="" />
            <p className={cls.text}>League</p>
        </Link>
        </div>
       
    </div>
  )
}

export default Header