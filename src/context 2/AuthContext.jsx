import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const localAdmin = localStorage.getItem('koon_admin_session');
        if (localAdmin === 'true') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCurrentUser({
                uid: 'admin-local',
                email: 'admin@bau.koon',
                displayName: 'Admin (Local)',
                role: 'admin'
            });
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const isAdmin = user.email?.toLowerCase() === import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
                let profileData = {};
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        profileData = docSnap.data();
                    }
                } catch (e) {
                    console.error("Error fetching user profile", e);
                }

                const userData = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName || user.email.split('@')[0],
                    role: isAdmin ? 'admin' : (profileData.role || 'student'),
                    ...profileData,
                    ...user
                };

                setCurrentUser(userData);
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email, password) => {
        if (email === 'admin' && password === 'admin123') {
            localStorage.setItem('koon_admin_session', 'true');
            setCurrentUser({
                uid: 'admin-local',
                email: 'admin@bau.koon',
                displayName: 'Admin (Local)',
                role: 'admin'
            });
            return Promise.resolve();
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password, additionalData = {}) => {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        try {
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: 'student',
                createdAt: new Date().toISOString(),
                completedMaterials: [],
                ...additionalData
            });
        } catch (e) {
            console.error("Error creating user profile", e);
        }
        return result;
    };

    const logout = () => {
        localStorage.removeItem('koon_admin_session');
        return signOut(auth);
    };

    const updateCurrentUserResult = async (updates) => {
        if (!currentUser || !currentUser.uid) return;
        setCurrentUser(prev => ({ ...prev, ...updates }));
        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, updates);
        } catch (e) {
            console.error("Error updating user profile", e);
        }
    };

    const value = {
        currentUser,
        login,
        signup,
        logout,
        updateCurrentUserResult
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
