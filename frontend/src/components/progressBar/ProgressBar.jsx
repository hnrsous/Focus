//ProgressBar.jsx
import './ProgressBar.css'

/**
 * ProgressBar
 * @param {number} value
 * @param {number} total
 * @param {string} label
 */
export default function ProgressBar({ value = 0, total = 0, label = 'Tasks concluídas' }) {
    const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0

    return (
        <div className="progress-bar">
            <div className="progress-bar-info">
                <span className="progress-bar-label">{label}</span>
                <span className="progress-bar-count">{value}/{total}</span>
            </div>
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percent}%` }}
                />
            </div>
        </div>
    )
}