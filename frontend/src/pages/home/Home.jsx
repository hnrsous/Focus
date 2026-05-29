//Home.jsx
import './Home.css'
import { useState } from 'react'

import { CloudSun, Bell, Calendar } from 'lucide-react'

import Notification from './views/notification/Notification'
import CalendarView from './views/calendar/Calendar'
import TodayCard from './views/todayCard/TodayCard'
import Tasks from './views/tasks/Tasks'
import ProfilePopup from '../../components/profilePopup/ProfilePopup'

import { dateKey } from '../../utils/dateKey'

export default function Home({ user, onSignOut }) {
    const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuário'

    const [activePanel, setActivePanel] = useState('today')
    const [showTasks, setShowTasks]     = useState(false)
    const [tasksDate, setTasksDate]     = useState(null)

    const [tasksByDay, setTasksByDay] = useState({})

    const openTasks = (date = new Date()) => {
        setTasksDate(date)
        setShowTasks(true)
    }

    const getTasksForDate = (date) => tasksByDay[dateKey(date)] || []

    const setTasksForDate = (date, tasks) => {
        setTasksByDay(prev => ({ ...prev, [dateKey(date)]: tasks }))
    }

    const today = new Date()
    const todayTasks = getTasksForDate(today)
    const todayDone  = todayTasks.filter(t => t.done).length
    const todayTotal = todayTasks.length

    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    const notifications = Object.entries(tasksByDay)
        .flatMap(([key, tasks]) => {
            const [y, m, d] = key.split('-').map(Number)
            const date = new Date(y, m, d)
            if (date < todayMidnight) return []
            return tasks
                .filter(t => !t.done)
                .map(t => ({ ...t, date }))
        })
        .sort((a, b) => a.date - b.date)
        .slice(0, 6)

    const panels = {
        today: (
            <TodayCard
                onOpen={() => openTasks()}
                done={todayDone}
                total={todayTotal}
            />
        ),
        notification: <Notification notifications={notifications} onSelectDay={(date) => openTasks(date)} />,
        calendar:     <CalendarView onSelectDay={(date) => openTasks(date)} tasksByDay={tasksByDay} />,
    }

    return (
        <div className="home">

            <header className='home-header'>
                <h1>Olá, {userName}</h1>
                <ProfilePopup user={user} onSignOut={onSignOut} />
            </header>

            <section className='home-section'>
                {showTasks
                    ? (
                        <Tasks
                            onBack={() => setShowTasks(false)}
                            date={tasksDate}
                            tasks={getTasksForDate(tasksDate)}
                            setTasks={(tasks) => setTasksForDate(tasksDate, tasks)}
                        />
                    ) : (
                        <main className="home-main">
                            <article className="home-article">
                                {panels[activePanel]}
                            </article>

                            <aside className="sidebar">
                                <button onClick={() => setActivePanel('today')}>
                                    <CloudSun size={38} color="rgb(5, 10, 60)" />
                                </button>
                                <button onClick={() => setActivePanel('calendar')}>
                                    <Calendar size={38} color="rgb(5, 10, 60)" />
                                </button>
                                <button onClick={() => setActivePanel('notification')}>
                                    <Bell size={38} color="rgb(5, 10, 60)" />
                                </button>
                            </aside>
                        </main>
                    )
                }
            </section>

        </div>
    )
}