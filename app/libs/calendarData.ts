export default function generateCalendarData(year: number, month: number) {
  const months = [];
  const date = new Date(year, month); // Start with the first day of the month

  for (let i = 0; i < 2; i++) { // Generate data for two months
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    const firstDay = (new Date(currentYear, currentMonth)).getDay();
 // Day of the week (0-6)
    const daysInMonth = 32 - new Date(currentYear, currentMonth, 32).getDate();
    const days = [];

    // Add days from the previous month
    for (let j = 0; j < firstDay; j++) {
      const prevMonthDate = new Date(currentYear, currentMonth, -j);
      days.push({ date: prevMonthDate.toISOString().split('T')[0] });
    }

    // Add days from the current month
    for (let j = 1; j <= daysInMonth; j++) {
      const currentDate = new Date(currentYear, currentMonth, j);
      days.push({
        date: currentDate.toISOString().split('T')[0],
        isCurrentMonth: true,
        isToday: currentDate.toDateString() === new Date().toDateString(),
      });
    }

    // Add days from the next month
    let nextMonthDays = 42 - days.length; // Total days in the calendar grid
    for (let j = 1; j <= nextMonthDays; j++) {
      const nextMonthDate = new Date(currentYear, currentMonth + 1, j);
      days.push({ date: nextMonthDate.toISOString().split('T')[0] });
    }

    months.push({
      name: date.toLocaleString('default', { month: 'long' }),
      days,
    });

    date.setMonth(currentMonth + 1); // Move to the next month
  }

  return months;
}

