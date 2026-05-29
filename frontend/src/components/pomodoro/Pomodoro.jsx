// Pomodoro.jsx

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, X } from 'lucide-react'
import './Pomodoro.css'

const WORK_DURATION = 5 * 60
const BREAK_DURATION = 5 * 60

export default function Pomodoro({ onClose }) {

    const [seconds, setSeconds] = useState(WORK_DURATION)
    const [running, setRunning] = useState(false)
    const [isBreak, setIsBreak] = useState(false)

    const intervalRef = useRef(null)

    useEffect(() => {

        if (!running) {
            clearInterval(intervalRef.current)
            return
        }

        intervalRef.current = setInterval(() => {

            setSeconds(s => {

                if (s <= 1) {

                    clearInterval(intervalRef.current)

                    setRunning(false)

                    const nextIsBreak = !isBreak

                    setIsBreak(nextIsBreak)

                    return nextIsBreak
                        ? BREAK_DURATION
                        : WORK_DURATION
                }

                return s - 1
            })

        }, 1000)

        return () => clearInterval(intervalRef.current)

    }, [running, isBreak])

    const finishTimer = () => {

        clearInterval(intervalRef.current)

        setRunning(false)
        setIsBreak(false)
        setSeconds(WORK_DURATION)

        onClose?.()
    }

    const total = isBreak
        ? BREAK_DURATION
        : WORK_DURATION

    const pct = Math.min(
        ((total - seconds) / total) * 100,
        100
    )

    const urgent =
        !isBreak &&
        seconds <= 60

    const mins = String(
        Math.floor(seconds / 60)
    ).padStart(2, '0')

    const secs = String(
        seconds % 60
    ).padStart(2, '0')

    return (

        <div
            className="pomodoro"
            onClick={e => e.stopPropagation()}
        >

            <span className={`pomodoro--time${urgent ? ' pomodoro--time--urgent' : ''}`}>
                {mins}:{secs}
            </span>

            <div className="pomodoro--track">

                <div
                    className={`pomodoro--fill${urgent ? ' pomodoro--fill--urgent' : ''}`}
                    style={{ width: `${pct}%` }}
                />

            </div>

            <div className="pomodoro--controls">

                <button
                    className="pomodoro--btn pomodoro--btn--stop"
                    title="Finalizar"
                    onClick={finishTimer}
                >
                    <X size={14} />
                </button>

                <button
                    className="pomodoro--btn"
                    title={running ? 'Pausar' : 'Iniciar'}
                    onClick={() => setRunning(v => !v)}
                >
                    {running
                        ? <Pause size={14} />
                        : <Play size={14} />
                    }
                </button>

                <button
                    className="pomodoro--btn pomodoro--btn--add"
                    title="+10 minutos"
                    onClick={() => setSeconds(s => s + 10 * 60)}
                >
                    +10min
                </button>
            </div>

        </div>
    )
}