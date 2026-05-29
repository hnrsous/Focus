//TaskNotes.jsx

import './TaskNotes.css'

import { useEffect, useState } from 'react'

export default function TaskNotes({ task, onClose, onSave }) {
    const [note, setNote] = useState('')

    useEffect(() => {
        if (task) {
            setNote(task.note || '')
        }
    }, [task])

    if (!task) return null

    return (
        <div
            className="task-note-overlay"
            onClick={onClose}
        >
            <div
                className="task-note-popup"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="task-note-header">
                    <h2>{task.name}</h2>

                    <button
                        className="task-note-save"
                        onClick={() => onSave(note)}
                    >
                        Salvar
                    </button>
                </div>

                <textarea
                    className="task-note-textarea"
                    placeholder="Escreva sua anotação..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>
        </div>
    )
}