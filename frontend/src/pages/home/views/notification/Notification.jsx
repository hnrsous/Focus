// Notification.jsx
import './Notification.css'

import { useState } from 'react'
import { Bell, ChevronRight as Open } from 'lucide-react'

export default function Notification({ notifications = [], onSelectDay }) {
    const [read, setRead] = useState([])

    const toggle = (id) =>
        setRead(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id])

    const handleClick = (n) => {
        if (onSelectDay) onSelectDay(n.date)
    }

    const pending = notifications.filter(n => !n.done).length

    return (
        <div className="notif-wrapper">

            <div className="notif-top-row">
                <Bell size={22} color="rgb(5, 10, 60)" />
                <span className="notif-title">Notificações</span>
                <span className="notif-count">{pending} pendentes</span>
            </div>

            <div className="notif-divider" />

            <ul className="notif-list">
                {notifications.length === 0 && (
                    <li className="notif-empty">Nenhuma notificação.</li>
                )}
                {notifications.map((n, i) => {
                    const isRead = read.includes(n.id)
                    const isToday = (() => {
                        const t = new Date()
                        return n.date.getFullYear() === t.getFullYear() &&
                               n.date.getMonth()    === t.getMonth()    &&
                               n.date.getDate()     === t.getDate()
                    })()

                    return (
                        <li
                            key={n.id}
                            className={`notif-item${isRead ? ' notif-item--read' : ''}`}
                            style={{ animationDelay: `${i * 0.07}s` }}
                            onClick={() => handleClick(n)}
                        >
                            <button
                                className={`notif-dot notif-dot--${isToday ? 'urgent' : 'upcoming'}${isRead ? ' notif-dot--active' : ''}`}
                                onClick={e => { e.stopPropagation(); toggle(n.id) }}
                            />

                            <div className="notif-body">
                                <span className="notif-task-title">{n.name}</span>
                                <span className="notif-desc">
                                    {isToday ? 'Hoje' : n.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                                </span>
                            </div>

                            <Open size={14} className="notif-arrow" />
                        </li>
                    )
                })}
            </ul>

        </div>
    )
}