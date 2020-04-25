import React, { createContext, useState } from 'react';

import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState({});

    async function signIn(userName, password) {
        console.log('chamada api', userName, password );
        setUser({
            userName,
            password
        })
    }

    return(
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

