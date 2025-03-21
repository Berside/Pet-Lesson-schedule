import React, { useState, useEffect, useRef } from 'react';
import './calendar.css';

const Calendar = ({ onDateSelect, selectedDate }) => {
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef(null);

    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const months = [
        'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ];

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = (firstDay.getDay() + 7) % 7;
    const totalDays = lastDay.getDate();

    const isToday = (day) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const handleDateClick = (day) => {
        const newDate = new Date(year, month, day);
        onDateSelect(newDate);
        setShowCalendar(false);
    };

    const handleMonthChange = (newMonth) => {
        const newDate = new Date(year, newMonth, selectedDate.getDate());
        onDateSelect(newDate);
    };

    const handleYearChange = (newYear) => {
        const newDate = new Date(newYear, month, selectedDate.getDate());
        onDateSelect(newDate);
    };

    const handlePrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        onDateSelect(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        onDateSelect(newDate);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="calendar-container" ref={calendarRef}>
            <button onClick={() => setShowCalendar(!showCalendar)} className="calendar-button">
                {formatDate(selectedDate)}
            </button>
            {showCalendar && (
                <div className="calendar">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth}>&lt;</button>
                        <select value={month} onChange={(e) => handleMonthChange(parseInt(e.target.value))}>
                            {months.map((monthName, index) => (
                                <option key={index} value={index}>
                                    {monthName}
                                </option>
                            ))}
                        </select>
                        <input type="number" value={year} onChange={(e) => handleYearChange(parseInt(e.target.value))}/>
                        <button onClick={handleNextMonth}>&gt;</button>
                    </div>
                    <div className="calendar-weekdays">
                        {days.map(day => (
                            <div key={day} className="weekday">{day}</div>
                        ))}
                    </div>
                    <div className="calendar-days">
                        {Array(startDay).fill(null).map((_, i) => (
                            <div key={`empty-${i}`} className="day empty" />
                        ))}
                        {Array(totalDays).fill(null).map((_, i) => {
                            const dayNumber = i + 1;
                            const currentDate = new Date(year, month, dayNumber);
                            const isSelected = currentDate.toDateString() === selectedDate.toDateString();
                            return (
                                <div key={dayNumber} className={`day ${isSelected ? 'selected' : ''} ${isToday(dayNumber) ? 'today' : ''}`} onClick={() => handleDateClick(dayNumber)}>
                                    {dayNumber}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;