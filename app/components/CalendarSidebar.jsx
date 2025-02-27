'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addDays, getDay, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import styles from './CalendarSidebar.module.css';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function CalendarSidebar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);
  const [todoCountByDate, setTodoCountByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  // 月を変更する関数
  const changeMonth = (amount) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + amount);
    setCurrentDate(newDate);
  };

  // 日付をクリックしたときの処理
  const handleDateClick = (day) => {
    setSelectedDate(day);
    // ここで選択された日付に関連するTodoを表示するなどの処理を追加できます
    console.log('選択された日付:', format(day, 'yyyy-MM-dd'));
  };

  // TODOデータを取得
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
          
          // 日付ごとのTODO数を計算
          const countByDate = {};
          data.forEach(todo => {
            const date = new Date(todo.createdAt).toISOString().split('T')[0];
            countByDate[date] = (countByDate[date] || 0) + 1;
          });
          setTodoCountByDate(countByDate);
        }
      } catch (error) {
        console.error('カレンダーデータの取得に失敗しました:', error);
      }
    };

    fetchTodos();
  }, []);

  // 現在の月のすべての日を取得
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // 週の始まりを月曜日に設定
  const dayOfWeek = ['月', '火', '水', '木', '金', '土', '日'];
  
  // 月曜日を0とした曜日のインデックスを取得する関数
  const getMondayBasedDayIndex = (date) => {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1; // 日曜日は6、月曜日は0になるように変換
  };

  // 曜日に基づいてクラスを取得する関数
  const getDayClass = (day) => {
    const dayOfWeek = getDay(day);
    if (dayOfWeek === 0) return styles.sunday; // 日曜日
    if (dayOfWeek === 6) return styles.saturday; // 土曜日
    return '';
  };

  // 数字を丸数字に変換する関数
  const getCircledNumber = (num) => {
    const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'];
    return num <= 10 ? circledNumbers[num - 1] : num.toString();
  };

  return (
    <div className={styles.calendarSidebar}>
      <h2 className={styles.calendarTitle}>
        <FaCalendarAlt className={styles.calendarIcon} /> カレンダー
      </h2>
      
      <div className={styles.monthNavigation}>
        <button 
          onClick={() => changeMonth(-1)}
          className={styles.navButton}
          aria-label="前月"
        >
          <FaChevronLeft />
        </button>
        <h3 className={styles.currentMonth}>
          {format(currentDate, 'yyyy年MM月', { locale: ja })}
        </h3>
        <button 
          onClick={() => changeMonth(1)}
          className={styles.navButton}
          aria-label="次月"
        >
          <FaChevronRight />
        </button>
      </div>
      
      <div className={styles.calendarGrid}>
        {dayOfWeek.map((day, index) => (
          <div 
            key={day} 
            className={`${styles.weekdayHeader} ${
              index === 5 ? styles.saturday : index === 6 ? styles.sunday : ''
            }`}
          >
            {day}
          </div>
        ))}
        
        {/* 月の最初の日の前に空白を挿入（月曜日基準） */}
        {Array.from({ length: getMondayBasedDayIndex(monthStart) }).map((_, index) => (
          <div key={`empty-${index}`} className={styles.emptyDay}></div>
        ))}
        
        {/* 月の日を表示 */}
        {daysInMonth.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const todoCount = todoCountByDate[dateStr] || 0;
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          
          return (
            <div 
              key={dateStr}
              onClick={() => handleDateClick(day)}
              className={`${styles.calendarDay} ${
                isToday(day) ? styles.today : ''
              } ${!isSameMonth(day, currentDate) ? styles.otherMonth : ''} ${
                getDayClass(day)
              } ${isSelected ? styles.selected : ''}`}
            >
              <span>{format(day, 'd')}</span>
              {todoCount > 0 && (
                <span className={styles.todoIndicator}>
                  {todoCount <= 5 ? getCircledNumber(todoCount) : getCircledNumber(5) + '+'}
                </span>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className={styles.selectedDateInfo}>
          <p>選択日: {format(selectedDate, 'yyyy年MM月dd日(EEE)', { locale: ja })}</p>
        </div>
      )}
    </div>
  );
} 