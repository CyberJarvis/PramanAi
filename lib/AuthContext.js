"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ROLES, hasPermission } from "@/lib/rbac";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/auth/me");
            const data = await res.json();
            if (data.success && data.user) {
                setUser(data.user);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        window.location.href = "/api/auth/logout";
    };

    const roleInfo = user?.role ? ROLES[user.role] : null;

    const can = (permission) => {
        if (!user?.role) return false;
        return hasPermission(user.role, permission);
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout, roleInfo, can }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}

export default AuthContext;
