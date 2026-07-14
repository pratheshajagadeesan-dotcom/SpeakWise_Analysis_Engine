import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function PrivateRoute({ children, adminOnly = false }) {
    const { user } = useAuth()

    if (!user) return <Navigate to="/login" replace />
    if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/practice" replace />

    return children
}