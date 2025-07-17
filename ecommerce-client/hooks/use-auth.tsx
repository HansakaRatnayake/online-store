"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
    id: string
    email: string
    name: string
    role: "admin" | "customer"
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check for stored auth data on mount
        const storedToken = localStorage.getItem("auth_token")
        const storedUser = localStorage.getItem("auth_user")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setToken(data.token)
                localStorage.setItem("auth_token", data.token)
                localStorage.setItem("auth_user", JSON.stringify(data.user))
                return true
            }
            return false
        } catch (error) {
            console.error("Login error:", error)
            return false
        }
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setToken(data.token)
                localStorage.setItem("auth_token", data.token)
                localStorage.setItem("auth_user", JSON.stringify(data.user))
                return true
            }
            return false
        } catch (error) {
            console.error("Register error:", error)
            return false
        }
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem("auth_token")
        localStorage.removeItem("auth_user")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>{children}</AuthContext.Provider>
    )
}
