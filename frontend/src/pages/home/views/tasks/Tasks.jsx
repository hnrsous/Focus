// Tasks.jsx

import './Tasks.css'

import { useState } from 'react'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'

import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove
} from '@dnd-kit/sortable'

import { CSS } from '@dnd-kit/utilities'

import { ChevronLeft as Back, Plus, Trash2, NotebookPen, Check, Timer, Pin, GripVertical } from 'lucide-react'

import ProgressBar from '../../../../components/progressBar/ProgressBar'
import Pomodoro from '../../../../components/pomodoro/Pomodoro'
import TaskNotes from '../../../../components/tasksNotes/TaskNotes'

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

const MONTHS = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
]

function SortableTask({ task, onToggleDone, onTogglePin, onSelectTask, onDeleteTask, onTogglePomodoro, pomodoroId }) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 10 : 'auto',
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            className={`tasks-item${task.done ? ' tasks-item-done' : ''}${task.pinned ? ' tasks-item-pinned' : ''}`}
            onClick={() => onToggleDone(task.id)}
        >

            <button
                className="tasks-drag"
                {...attributes}
                {...listeners}
                onClick={(e) => e.stopPropagation()}
                title="Arrastar"
            >
                <GripVertical size={14} />
            </button>

            <button
                className={`tasks-check${task.done ? ' tasks-check-active' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleDone(task.id) }}
            >
                {task.done && <Check size={11} />}
            </button>

            <span className="tasks-name">{task.name}</span>

            <div className="tasks-actions">

                {!task.done && (
                    <button
                        className={`tasks-action tasks-action-pin${task.pinned ? ' tasks-action-pin-active' : ''}`}
                        title="Fixar tarefa"
                        onClick={(e) => { e.stopPropagation(); onTogglePin(task.id) }}
                    >
                        <Pin size={14} />
                    </button>
                )}

                <button
                    className="tasks-action tasks-action-note"
                    title="Anotações"
                    onClick={(e) => { e.stopPropagation(); onSelectTask(task) }}
                >
                    <NotebookPen size={14} />
                </button>

                {!task.done && (
                    <button
                        className={`tasks-action tasks-action-pomodoro${pomodoroId === task.id ? ' tasks-action-pomodoro-active' : ''}`}
                        title="Pomodoro"
                        onClick={(e) => {
                            e.stopPropagation()
                            onTogglePomodoro(task.id)
                        }}
                    >
                        <Timer size={14} />
                    </button>
                )}

                <button
                    className="tasks-action tasks-action-delete"
                    title="Deletar"
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id) }}
                >
                    <Trash2 size={14} />
                </button>

            </div>

            {pomodoroId === task.id && !task.done && (
                <Pomodoro onClose={() => onTogglePomodoro(null)} />
            )}

        </li>
    )
}

export default function Tasks({
    onBack,
    date,
    tasks = [],
    setTasks
}) {

    const ref = date instanceof Date ? date : new Date()
    const weekday = WEEKDAYS[ref.getDay()]
    const label = `${String(ref.getDate()).padStart(2, '0')} de ${MONTHS[ref.getMonth()]}. de ${ref.getFullYear()}`

    const [input, setInput] = useState('')
    const [selectedTask, setSelectedTask] = useState(null)
    const [pomodoroId, setPomodoroId] = useState(null)

    const done = tasks.filter(t => t.done).length
    const total = tasks.length

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 }
        })
    )

    const addTask = () => {
        const name = input.trim().slice(0, 34)
        if (!name) return
        setTasks([
            ...tasks,
            {
                id: Date.now(),
                name,
                done: false,
                note: '',
                pinned: false,
                pinnedAt: null
            }
        ])
        setInput('')
    }

    const toggleDone = (id) => {
        if (pomodoroId === id) setPomodoroId(null)
        setTasks(tasks.map(t =>
            t.id === id
                ? { ...t, done: !t.done, pinned: false, pinnedAt: null }
                : t
        ))
    }

    const togglePin = (id) => {
        const task = tasks.find(t => t.id === id)
        if (!task) return

        if (task.pinned) {
            setTasks(tasks.map(t =>
                t.id === id ? { ...t, pinned: false, pinnedAt: null } : t
            ))
            return
        }

        const pinnedTasks = tasks
            .filter(t => t.pinned)
            .sort((a, b) => a.pinnedAt - b.pinnedAt)

        let updatedTasks = [...tasks]

        if (pinnedTasks.length >= 3) {
            const oldestPinned = pinnedTasks[0]
            updatedTasks = updatedTasks.map(t =>
                t.id === oldestPinned.id ? { ...t, pinned: false, pinnedAt: null } : t
            )
        }

        updatedTasks = updatedTasks.map(t =>
            t.id === id ? { ...t, pinned: true, pinnedAt: Date.now() } : t
        )

        setTasks(updatedTasks)
    }

    const deleteTask = (id) => {
        if (pomodoroId === id) setPomodoroId(null)
        setTasks(tasks.filter(t => t.id !== id))
    }

    const handleKey = (e) => {
        if (e.key === 'Enter') addTask()
    }

    const saveNote = (note) => {
        if (!selectedTask) return
        setTasks(tasks.map(t =>
            t.id === selectedTask.id ? { ...t, note } : t
        ))
        setSelectedTask(null)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = sortedTasks.findIndex(t => t.id === active.id)
        const newIndex = sortedTasks.findIndex(t => t.id === over.id)
        const reordered = arrayMove(sortedTasks, oldIndex, newIndex)

        const reorderedIds = reordered.map(t => t.id)
        setTasks(reorderedIds.map(id => tasks.find(t => t.id === id)))
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.done && !b.done) return 1
        if (!a.done && b.done) return -1
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        if (a.pinned && b.pinned) return b.pinnedAt - a.pinnedAt
        return 0
    })

    return (
        <div className="tasks-wrapper">

            <div className="tasks-top">

                <button className="tasks-back" onClick={onBack}>
                    <Back size={16} />
                    <div className="tasks-back-date">
                        <span className="tasks-back-weekday">{weekday}</span>
                        <span className="tasks-back-day">{label}</span>
                    </div>
                </button>

                <div className="tasks-top-right">

                    <ProgressBar value={done} total={total} label="Progresso do dia" />

                    <div className="tasks-input-row">
                        <div className="tasks-input-wrap">
                            <input
                                className="tasks-input"
                                placeholder="Nome da tarefa..."
                                value={input}
                                maxLength={34}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKey}
                            />
                            {input.length > 0 && (
                                <span className="tasks-input-count">{input.length}/34</span>
                            )}
                        </div>
                        <button className="tasks-add" onClick={addTask}>
                            <Plus size={16} />
                        </button>
                    </div>

                </div>

            </div>

            <div className="tasks-divider" />

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sortedTasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <ul className="tasks-list">

                        {tasks.length === 0 && (
                            <li className="tasks-empty">
                                Nenhuma tarefa ainda. Adicione uma acima.
                            </li>
                        )}

                        {sortedTasks.map((task) => (
                            <SortableTask
                                key={task.id}
                                task={task}
                                pomodoroId={pomodoroId}
                                onToggleDone={toggleDone}
                                onTogglePin={togglePin}
                                onSelectTask={setSelectedTask}
                                onDeleteTask={deleteTask}
                                onTogglePomodoro={(id) => setPomodoroId(prev => prev === id ? null : id)}
                            />
                        ))}

                    </ul>
                </SortableContext>
            </DndContext>

            <TaskNotes
                task={selectedTask}
                onClose={() => setSelectedTask(null)}
                onSave={saveNote}
            />

        </div>
    )
}