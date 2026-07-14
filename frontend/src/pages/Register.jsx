import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

export default function Register() {
    const [name, setName] = useState('')
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
            const res = await api.post('/auth/register', { name, email, password })
            login(res.data)
            navigate('/practice')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ maxWidth: 400, marginTop: 60 }}>
            <Card>
                <h2>Create your SpeakWise account</h2>
                {error && <p className="error-text">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password (min 6 chars)" value={password}
                           onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                    <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</Button>
                </form>
                <p style={{ marginTop: 16, fontSize: 14 }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </Card>
        </div>
    )
}