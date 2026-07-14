import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Practice from './pages/Practice.jsx'
import Report from './pages/Report.jsx'
import History from './pages/History.jsx'
import Admin from './pages/Admin.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Profile from './pages/Profile.jsx'

function Layout() {
  const { user } = useAuth()
  return (
      <>
        {user && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/practice" element={<PrivateRoute><Practice /></PrivateRoute>} />
          <Route path="/report/:id" element={<PrivateRoute><Report /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute adminOnly><Admin /></PrivateRoute>} />

          <Route path="/" element={<Navigate to="/practice" replace />} />
          <Route path="*" element={<Navigate to="/practice" replace />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />npm reunnpm run dev
        </Routes>
      </>
  )
}

export default function App() {
  return (
      <AuthProvider>
        <Layout />
      </AuthProvider>
  )
}