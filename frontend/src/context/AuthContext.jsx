import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('speakwise_user')
        return stored ? JSON.parse(stored) : null
    })

    const login = (authResponse) => {
        const { token, name, email, role } = authResponse
        sessionStorage.setItem('speakwise_token', token)
        const userData = { name, email, role }
        sessionStorage.setItem('speakwise_user', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        sessionStorage.removeItem('speakwise_token')
        sessionStorage.removeItem('speakwise_user')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}