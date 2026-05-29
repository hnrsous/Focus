//Calendar.jsx

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import './Calendar.css'

import { dateKey } from '../../../../utils/dateKey'

const WEEKDAYS = ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sáb.']

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

export default function Calendar({ onSelectDay, tasksByDay = {} }) {
    const today = new Date()
    const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() })
    const [selected, setSelected] = useState(today.getDate())

    const prevMonth = () => setCurrent(c =>
        c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year }
    )
    const nextMonth = () => setCurrent(c =>
        c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year }
    )

    const firstDay = new Date(current.year, current.month, 1).getDay()
    const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
    const daysInPrev = new Date(current.year, current.month, 0).getDate()
    const isCurrentMonth = current.month === today.getMonth() && current.year === today.getFullYear()

    const cells = []
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, type: 'prev' })
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, type: 'current' })
    const remaining = 42 - cells.length
    for (let d = 1; d <= remaining; d++) cells.push({ day: d, type: 'next' })

    const isPast = (cell) => {
        if (cell.type !== 'current') return false
        const cellDate = new Date(current.year, current.month, cell.day)
        const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        if (cellDate >= todayMidnight) return false
        const key = dateKey(new Date(current.year, current.month, cell.day))
        const hasTasks = tasksByDay[key] && tasksByDay[key].length > 0
        return !hasTasks
    }

    const handleDayClick = (cell) => {
        if (cell.type !== 'current') return
        if (isPast(cell)) return
        setSelected(cell.day)
        if (onSelectDay) {
            const date = new Date(current.year, current.month, cell.day)
            onSelectDay(date)
        }
    }

    return (
        <div className="calendar-wrapper">

            <div className="cal-top-row">
                <CalendarIcon size={22} color="rgb(5, 10, 60)" />
                <div className="cal-title">
                    <span className="cal-month">{MONTHS[current.month]}</span>
                    <span className="cal-year">{current.year}</span>
                </div>
                <div className="cal-nav-group">
                    <button className="cal-nav" onClick={prevMonth}>
                        <ChevronLeft size={16} />
                    </button>
                    <button className="cal-nav" onClick={nextMonth}>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="cal-weekdays">
                {WEEKDAYS.map(w => (
                    <span key={w} className="cal-weekday">{w}</span>
                ))}
            </div>

            <div className="cal-grid">
                {cells.map((cell, i) => {
                    const isToday = isCurrentMonth && cell.type === 'current' && cell.day === today.getDate()
                    const isSelected = cell.type === 'current' && cell.day === selected && isCurrentMonth
                    const past = isPast(cell)
                    const cellDate = new Date(current.year, current.month, cell.day)
                    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                    const isPastDay = cell.type === 'current' && cellDate < todayMidnight
                    const key = dateKey(new Date(current.year, current.month, cell.day))
                    const hasPastTasks = isPastDay && tasksByDay[key] && tasksByDay[key].length > 0
                    return (
                        <button
                            key={i}
                            className={[
                                'cal-day',
                                cell.type !== 'current' ? 'cal-day--faded' : '',
                                isToday ? 'cal-day--today' : '',
                                isSelected && !isToday ? 'cal-day--selected' : '',
                                past ? 'cal-day--past' : '',
                                hasPastTasks ? 'cal-day--past-tasks' : '',
                            ].join(' ')}
                            onClick={() => handleDayClick(cell)}
                            disabled={past}
                        >
                            {cell.day}
                            {hasPastTasks && <span className="cal-day__dot" />}
                        </button>
                    )
                })}
            </div>

        </div>
    )
}