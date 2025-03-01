export default function generateCalendarData(year: number, month: number) {
  const months = [];
  const date = new Date(year, month);

  for (let i = 0; i < 2; i++) {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Convert Sunday (0) to 7, and shift all days by -1 to make Monday (1) the first day
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days = [];

    // Add days from the previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = new Date(prevYear, prevMonth + 1, 0).getDate();
    
    for (let j = adjustedFirstDay - 1; j >= 0; j--) {
      const day = prevMonthDays - j;
      days.push({ 
        date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        isCurrentMonth: false
      });
    }

    // Add days from the current month
    for (let j = 1; j <= daysInMonth; j++) {
      days.push({
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`,
        isCurrentMonth: true,
        isToday: new Date(currentYear, currentMonth, j).toDateString() === new Date().toDateString(),
      });
    }

    // Add days from the next month
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const totalDaysNeeded = 42; // 6 weeks × 7 days
    const remainingDays = totalDaysNeeded - days.length;
    
    for (let j = 1; j <= remainingDays; j++) {
      days.push({ 
        date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(j).padStart(2, '0')}`,
        isCurrentMonth: false
      });
    }

    months.push({
      name: date.toLocaleString('default', { month: 'long' }),
      days,
    });

    date.setMonth(currentMonth + 1);
  }

  return months;
}

