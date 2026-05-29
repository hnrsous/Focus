// TodayCard.jsx
import './TodayCard.css'

import { ChevronRight } from 'lucide-react'

import ProgressBar from '../../../../components/progressBar/ProgressBar'

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const MONTHS   = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.']

export default function TodayCard({ onOpen, done = 0, total = 0 }) {
    const today   = new Date()
    const weekday = WEEKDAYS[today.getDay()]
    const date    = `${String(today.getDate()).padStart(2, '0')} de ${MONTHS[today.getMonth()]} de ${today.getFullYear()}`

    return (
        <div className="today-wrapper" onClick={onOpen}>

            <div className="today-top-row">
                <span className="today-label">Hoje,</span>
                <span className="today-count">{done}/{total}</span>
                <button className="today-open" onClick={e => { e.stopPropagation(); onOpen() }}>
                    <ChevronRight size={36} opacity={.4}/>
                </button>
            </div>

            <div className="today-center">
                <span className="today-weekday">{weekday}</span>
                <span className="today-date">{date}</span>
            </div>

            <div className="today-footer">
                <ProgressBar value={done} total={total} />
            </div>

        </div>
    )
}