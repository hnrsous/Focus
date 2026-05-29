// ProfilePopup.jsx

import { useState, useRef, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import './ProfilePopup.css'

export default function ProfilePopup({ user, onSignOut }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    const userName = user?.displayName || user?.email?.split('@')[0] || 'Usuário'
    const initial = userName.charAt(0).toUpperCase()

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }

        document.addEventListener('mousedown', handler)

        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="profile-anchor" ref={ref}>
            <div
                className="profile-avatar"
                onClick={() => setOpen(v => !v)}
            >
                {initial}
            </div>

            {open && (
                <div className="profile-popup">
                    <div className="profile-popup-info">
                        <span className="profile-popup-name">{userName}</span>
                        <span className="profile-popup-email">{user?.email || ''}</span>
                    </div>

                    <div className="profile-popup-divider" />

                    <button
                        className="profile-popup-signout"
                        onClick={() => {
                            setOpen(false)
                            onSignOut?.()
                        }}
                    >
                        <LogOut size={14} />
                        Sair
                    </button>
                </div>
            )}
        </div>
    )
}