import React, { useState } from 'react';
import './app.css';
import humanIcon from './assets/human.png';
import pointIcon from './assets/point.png';
import predmetIcon from './assets/predmet.png';
import timeIcon from './assets/time.png';
import tipIcon from './assets/tip.png';
import leftArrow from './assets/leftArrow.png';
import RightArrow from './assets/RightArrow.png';
import scheduleData from './store/ИДБ-22-10_v2.2.json';
import Calendar from './components/Calendar.tsx';

const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const getWeekdayName = (date) => {
    const weekdays = [
        'Воскресенье',
        'Понедельник',
        'Вторник',
        'Среда',
        'Четверг',
        'Пятница',
        'Суббота'
    ];
    return weekdays[date.getDay()];
};

const getNextSixDays = (offset = 0) => {
    const dates = [];
    const today = new Date();
    today.setDate(today.getDate() + offset);
    for (let i = 0; i < 6; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        dates.push(formatDate(date));
    }
    return dates;
};

const isCurrentClass = (entry, currentDate) => {
    const now = new Date();
    const today = formatDate(now);
    if (today !== entry.date) return false;
    const currentTime = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return currentTime >= entry.time_start && currentTime <= entry.time_end;
};

const isPastClass = (entry) => {
    const now = new Date();
    const today = formatDate(now);
    if (today !== entry.date) return false;
    const currentTime = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return currentTime > entry.time_end;
};

function App() {
    const [offset, setOffset] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const groupByDay = (schedule) => {
        const grouped = {};
        schedule.forEach((entry) => {
            const date = entry.date;
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(entry);
        });
        return grouped;
    };
    const groupedSchedule = groupByDay(scheduleData);
    const daysToShow = getNextSixDays(offset);

    const handleDateSelect = (date) => {
        const diffTime = date - new Date();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setOffset(diffDays);
    };

    return (
        <div className="App">
            <h1>Расписание занятий ИДБ-22-10</h1>

            <div className="navigation-buttons">
                <button onClick={() => setOffset(prev => prev - 6)} className="nav-button">
                    <img src={leftArrow} alt="Предыдущие дни" className="nav-icon" />
                </button>
                <Calendar onDateSelect={handleDateSelect} />
                <button onClick={() => setOffset(prev => prev + 6)} className="nav-button">
                    <img src={RightArrow} alt="Следующие дни" className="nav-icon" />
                </button>
            </div>

            <div className="week-schedule">
                {daysToShow.map(date => {
                    const scheduleEntries = groupedSchedule[date];
                    if (!scheduleEntries) return null;
                    const currentDate = new Date();
                    currentDate.setDate(currentDate.getDate() + offset + daysToShow.indexOf(date));
                    return (
                        <div key={date} className="day-card">
                            <h2>
                                {getWeekdayName(currentDate)}, {date}
                            </h2>
                            {scheduleEntries.map((entry, idx) => (
                                <div
                                    key={idx}
                                    className={`subject-card ${isCurrentClass(entry, currentDate) ? 'current-class' : ''} ${isPastClass(entry) ? 'past-class' : ''} `}>
                                    <div className="info-row">
                                        <img src={predmetIcon} alt="Предмет" className="icon" />
                                        <span>{entry.subject}</span>
                                    </div>
                                    <div className="info-row">
                                        <img src={timeIcon} alt="Время" className="icon" />
                                        <span>{entry.time_start} - {entry.time_end}</span>
                                    </div>
                                    <div className="info-row">
                                        <img src={humanIcon} alt="Преподаватель" className="icon" />
                                        <span>{entry.professor || 'Не указан'}</span>
                                    </div>
                                    <div className="info-row">
                                        <img src={pointIcon} alt="Место" className="icon" />
                                        <span>{entry.room || 'Не указано'}</span>
                                    </div>
                                    <div className="info-row">
                                        <img src={tipIcon} alt="Тип занятия" className="icon" />
                                        <span>{entry.type}</span>
                                    </div>
                                    {entry.type === 'лабораторные занятия' && (
                                        <div className="info-row">
                                            <span className="subgroup">Подгруппа: {entry.subgroup}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default App;