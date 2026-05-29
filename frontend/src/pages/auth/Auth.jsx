// Auth.jsx
import './Auth.css'
import { useState } from 'react'

import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { login, register, recoverPassword } from './authService'


function LoginView({ onSuccess, onGoRegister, onGoRecover }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try { onSuccess(await login({ email, password })) }
        catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }

    const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

    return (
        <>
            <div className="auth-header">
                <span className="auth-eyebrow">Login</span>
                <h1 className="auth-title">Bem-vindo!</h1>
            </div>

            <div className="auth-form">
                <div className="auth-field">
                    <label className="auth-label">E-mail</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><Mail size={14} /></span>
                        <input className="auth-input" type="email" placeholder="email@example.com"
                            value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} />
                    </div>
                </div>

                <div className="auth-field">
                    <label className="auth-label">Senha</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><Lock size={14} /></span>
                        <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                            value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} />
                        <button className="auth-input-toggle" onClick={() => setShowPw(v => !v)}>
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="auth-spinner" /> : 'Entrar'}
                </button>
            </div>

            <div className="auth-divider" />

            <div className="auth-footer">
                <div className="auth-link-row">
                    Não tem conta?
                    <button className="auth-link" onClick={onGoRegister}>Criar conta</button>
                </div>
                <button className="auth-link auth-link--subtle" onClick={onGoRecover}>
                    Esqueci minha senha
                </button>
            </div>
        </>
    )
}

function RegisterView({ onSuccess, onGoLogin }) {
    const [name, setName]         = useState('')
    const [email, setEmail]       = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw]     = useState(false)
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState('')

    const handleSubmit = async () => {
        setError('')
        if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); return }
        setLoading(true)
        try { onSuccess(await register({ name, email, password })) }
        catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }

    const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

    return (
        <>
            <div className="auth-header">
                <span className="auth-eyebrow">Nova conta</span>
                <h1 className="auth-title">Criar conta.</h1>
            </div>

            <div className="auth-form">
                <div className="auth-field">
                    <label className="auth-label">Nome</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><User size={14} /></span>
                        <input className="auth-input" type="text" placeholder="Seu nome"
                            value={name} onChange={e => setName(e.target.value)} onKeyDown={handleKey} />
                    </div>
                </div>

                <div className="auth-field">
                    <label className="auth-label">E-mail</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><Mail size={14} /></span>
                        <input className="auth-input" type="email" placeholder="seu@email.com"
                            value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} />
                    </div>
                </div>

                <div className="auth-field">
                    <label className="auth-label">Senha</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><Lock size={14} /></span>
                        <input className="auth-input" type={showPw ? 'text' : 'password'} placeholder="mín. 6 caracteres"
                            value={password} onChange={e => setPassword(e.target.value)} onKeyDown={handleKey} />
                        <button className="auth-input-toggle" onClick={() => setShowPw(v => !v)}>
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                    </div>
                </div>

                {error && <p className="auth-error">{error}</p>}

                <button className="auth-submit" onClick={handleSubmit} disabled={loading}>
                    {loading ? <span className="auth-spinner" /> : 'Criar conta'}
                </button>
            </div>

            <div className="auth-divider" />

            <div className="auth-footer">
                <div className="auth-link-row">
                    Já tem conta?
                    <button className="auth-link" onClick={onGoLogin}>Entrar</button>
                </div>
            </div>
        </>
    )
}

function RecoverView({ onGoLogin }) {
    const [email, setEmail]     = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState('')
    const [sent, setSent]       = useState(false)

    const handleSubmit = async () => {
        setError('')
        setLoading(true)
        try { await recoverPassword({ email }); setSent(true) }
        catch (e) { setError(e.message) }
        finally { setLoading(false) }
    }

    const handleKey = (e) => { if (e.key === 'Enter') handleSubmit() }

    return (
        <>
            <div className="auth-header">
                <span className="auth-eyebrow">Recuperação</span>
                <h1 className="auth-title">Esqueceu a senha?</h1>
            </div>

            <div className="auth-form">
                <div className="auth-field">
                    <label className="auth-label">E-mail</label>
                    <div className="auth-input-wrap">
                        <span className="auth-input-icon"><Mail size={14} /></span>
                        <input className="auth-input" type="email" placeholder="seu@email.com"
                            value={email} onChange={e => setEmail(e.target.value)} onKeyDown={handleKey} disabled={sent} />
                    </div>
                </div>

                {error && <p className="auth-error">{error}</p>}
                {sent  && <p className="auth-success">Link enviado! Verifique sua caixa de entrada.</p>}

                <button className="auth-submit" onClick={handleSubmit} disabled={loading || sent}>
                    {loading ? <span className="auth-spinner" /> : sent ? 'Enviado ✓' : 'Enviar link'}
                </button>
            </div>

            <div className="auth-divider" />

            <div className="auth-footer">
                <div className="auth-link-row">
                    Lembrou a senha?
                    <button className="auth-link" onClick={onGoLogin}>Voltar ao login</button>
                </div>
            </div>
        </>
    )
}

export default function Auth({ onAuthenticated }) {
    const [view, setView] = useState('login')

    const views = {
        login:    <LoginView    onSuccess={u => onAuthenticated?.(u)} onGoRegister={() => setView('register')} onGoRecover={() => setView('recover')} />,
        register: <RegisterView onSuccess={u => onAuthenticated?.(u)} onGoLogin={() => setView('login')} />,
        recover:  <RecoverView  onGoLogin={() => setView('login')} />,
    }

    return (
        <div className="auth">
            <div className="auth-card" key={view}>
                {views[view]}
            </div>
        </div>
    )
}