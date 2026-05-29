// App.js
import { useState } from 'react'
import Auth from './pages/auth/Auth'
import Home from './pages/home/Home'

export default function App() {
    const [user, setUser] = useState(null)

    if (!user) {
        return <Auth onAuthenticated={(u) => setUser(u)} />
    }

    return <Home user={user} onSignOut={() => setUser(null)} />
}