import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api.js'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

export default function ResetPassword() {
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            await api.post('/auth/reset-password', { email, newPassword })
            setSuccess(true)
            setTimeout(() => navigate('/login'), 1800)
        } catch (err) {
            setError(err.response?.data?.message || 'Could not reset password. Check your email address.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container" style={{ maxWidth: 420, marginTop: 60 }}>
            <Card>
                <h2>Reset your password</h2>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: -8, marginBottom: 18 }}>
                    Enter your account email and choose a new password.
                </p>

                {success ? (
                    <p style={{ color: '#065f46', background: '#d1fae5', padding: '10px 14px', borderRadius: 10, fontWeight: 500 }}>
                        Password reset! Redirecting to login...
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {error && <p className="error-text">{error}</p>}
                        <input
                            type="email" placeholder="Your account email" value={email}
                            onChange={(e) => setEmail(e.target.value)} required
                            style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        />
                        <input
                            type="password" placeholder="New password (min 6 chars)" value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)} required minLength={6}
                            style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        />
                        <input
                            type="password" placeholder="Confirm new password" value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6}
                            style={{ display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }}
                        />
                        <Button type="submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</Button>
                    </form>
                )}

                <p style={{ marginTop: 18, fontSize: 14 }}>
                    <Link to="/login">Back to login</Link>
                </p>
            </Card>
        </div>
    )
}