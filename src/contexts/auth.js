import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import showAlertError from '../components/AlertError';

import api from '../services/api';

const AuthContext = createContext( { signed: false, user: {} } ); //value types 

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storageUser = await AsyncStorage.getItem('@QuizApp_user');
            const storageToken = await AsyncStorage.getItem('@QuizApp_userToken');

            if (storageUser && storageToken) {
                setUser(JSON.parse(storageUser));
                setLoading(false);
            } else if (!storageUser && !storageToken) {
                setLoading(false);
            }
        }

        loadStorageData();
    }, []);

    async function signIn(userName, password) {
        try {
            const { data } = await api.post('/auth/authenticate', { userName, password });

            setUser(data.user);
            //Save data on AsyncStorage
            try {
                await AsyncStorage.multiSet([
                    ["@QuizApp_user", JSON.stringify(data.user)],
                    ["@QuizApp_userToken", data.token],
                ]);
            } catch (err) {
                console.log(err);
                console.log('Error trying to storage user data');
            }

        } catch (err) {
            showAlertError('Erro ao fazer login', err.response.data.error);
        }
    }

    async function signInAsGuest() {
        console.log('Signing In as a guest ');
        
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null);
        });
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

