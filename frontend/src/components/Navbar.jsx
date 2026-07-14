import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="navbar">
            <div>
                <Link to="/practice">Practice</Link>
                <Link to="/history">History</Link>
                {user?.role === 'ADMIN' && <Link to="/admin">Admin</Link>}
                <Link to="/profile">Profile</Link>
            </div>
            <div>
                {user ? (
                    <>
                        <span style={{ marginRight: 16 }}>{user.name}</span>
                        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </div>
    )
}