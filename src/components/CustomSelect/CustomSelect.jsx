import React, { useState, useEffect, useRef } from "react";
import cls from "./CustomSelect.module.scss"; // Создайте отдельный файл стилей для кастомного селекта

const CustomSelect = ({ options, selectedOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Закрытие при клике вне селекта
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cls.customSelect} ref={selectRef}>
      <div
        className={cls.selectedOption}
        onClick={handleToggle}
      >
        {options.find((opt) => opt.value === selectedOption)?.label || "Выберите"}
      </div>
      {isOpen && (
        <div className={cls.optionsList}>
          {options.map((option) => (
            <div
              key={option.value}
              className={cls.option}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
