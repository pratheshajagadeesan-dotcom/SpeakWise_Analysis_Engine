import { useEffect, useState } from 'react'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import Card from '../components/Card.jsx'
import Button from '../components/Button.jsx'

export default function Profile() {
    const { user, login } = useAuth()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [profileMessage, setProfileMessage] = useState('')
    const [profileError, setProfileError] = useState('')
    const [savingProfile, setSavingProfile] = useState(false)
    const [loading, setLoading] = useState(true)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [savingPassword, setSavingPassword] = useState(false)

    useEffect(() => {
        api.get('/users/me')
            .then((res) => {
                setName(res.data.name)
                setEmail(res.data.email)
            })
            .finally(() => setLoading(false))
    }, [])

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setProfileError('')
        setProfileMessage('')
        setSavingProfile(true)
        try {
            const res = await api.put('/users/me', { name, email })
            setProfileMessage('Profile updated successfully.')

            const token = sessionStorage.getItem('speakwise_token')
            login({ token, name: res.data.name, email: res.data.email, role: res.data.role })
        } catch (err) {
            setProfileError(err.response?.data?.message || 'Failed to update profile.')
        } finally {
            setSavingProfile(false)
        }
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordMessage('')

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.')
            return
        }

        setSavingPassword(true)
        try {
            await api.put('/users/me/password', { currentPassword, newPassword })
            setPasswordMessage('Password changed successfully.')
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Failed to change password.')
        } finally {
            setSavingPassword(false)
        }
    }

    const inputStyle = { display: 'block', width: '100%', padding: '12px 14px', borderRadius: 10, border: '2px solid #e2e8f0' }

    if (loading) return <div className="container">Loading profile...</div>

    return (
        <div className="container">
            <h2>My Profile</h2>

            <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1e3a8a, #0f766e)',
                        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 22, fontWeight: 700,
                    }}>
                        {name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{name}</p>
                        <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
                            {user?.role === 'ADMIN' ? 'Administrator' : 'Student'} account
                        </p>
                    </div>
                </div>

                <h3>Edit details</h3>
                {profileMessage && <p style={{ color: '#166534', marginBottom: 12 }}>{profileMessage}</p>}
                {profileError && <p className="error-text">{profileError}</p>}
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input style={inputStyle} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div>
                        <Button type="submit" disabled={savingProfile}>{savingProfile ? 'Saving...' : 'Save changes'}</Button>
                    </div>
                </form>
            </Card>

            <Card>
                <h3 style={{ marginTop: 0 }}>Change password</h3>
                {passwordMessage && <p style={{ color: '#166534', marginBottom: 12 }}>{passwordMessage}</p>}
                {passwordError && <p className="error-text">{passwordError}</p>}
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <input style={inputStyle} type="password" placeholder="Current password" value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)} required />
                    <input style={inputStyle} type="password" placeholder="New password (min 6 chars)" value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                    <input style={inputStyle} type="password" placeholder="Confirm new password" value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                    <div>
                        <Button type="submit" disabled={savingPassword}>{savingPassword ? 'Updating...' : 'Change password'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    )
}