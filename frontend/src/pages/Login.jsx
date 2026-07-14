import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await api.post('/auth/login', { email, password })
            login(res.data)
            navigate('/practice')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check your credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
        }}>
            <div style={{
                display: 'flex', width: '100%', maxWidth: 900,
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(15, 23, 42, 0.15)',
            }}>
                <div style={{
                    flex: 1, minWidth: 260,
                    background: 'linear-gradient(160deg, #0f172a, #1e3a8a 60%, #0f766e)',
                    color: 'white', padding: '48px 36px',
                    display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: 'rgba(255,255,255,0.12)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 24,
                    }}>🎤</div>
                    <h1 style={{
                        color: 'white', WebkitTextFillColor: 'white', background: 'none',
                        fontSize: 30, marginBottom: 12,
                    }}>SpeakWise</h1>
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, lineHeight: 1.6 }}>
                        Practice interview answers, get instant feedback on your pace, filler words,
                        and how well you cover the key points — powered by real speech analysis.
                    </p>
                </div>

                <div style={{
                    flex: 1, minWidth: 280, background: 'white',
                    padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                    <h2 style={{ marginBottom: 6 }}>Welcome back</h2>
                    <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                        Log in to continue practicing.
                    </p>

                    {error && <p className="error-text">{error}</p>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        <input
                            type="email" placeholder="Email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                            style={{ display: 'block', width: '100%', padding: '13px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        />
                        <input
                            type="password" placeholder="Password" value={password}
                            onChange={(e) => setPassword(e.target.value)} required
                            style={{ display: 'block', width: '100%', padding: '13px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        />
                        <div style={{ textAlign: 'right', marginTop: -6 }}>
                            <Link to="/reset-password" style={{ fontSize: 13 }}>Forgot password?</Link>
                        </div>
                        <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
                    </form>

                    <p style={{ marginTop: 20, fontSize: 14 }}>
                        No account? <Link to="/register">Register here</Link>
                    </p>
                    <p style={{ marginTop: 10, fontSize: 12.5, color: '#94a3b8' }}>
                        Seeded admin login: admin@speakwise.com / admin123
                    </p>
                </div>
            </div>
        </div>
    )
}