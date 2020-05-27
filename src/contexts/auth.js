import React, { createContext, useState, useEffect, } from 'react';
import showAlertError from '../components/AlertError';
import AsyncStorage from '@react-native-community/async-storage';


import api from '../services/api';


const AuthContext = createContext({ signed: false, user: {}, loading: true }); //value types 

export function AuthProvider({ children }) {
    let _isMounted = true;

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStorageData() {
            const storagedUser = await AsyncStorage.getItem('@QuizApp_user');
            const storagedToken = await AsyncStorage.getItem('@QuizApp_userToken');

            if (storagedUser && storagedToken) {
                api.defaults.headers.authorization = `Bearer ${storagedToken}`;

                setUser(JSON.parse(storagedUser));
                setLoading(false);
            } else if (!storagedUser && !storagedToken) {
                setLoading(false);
            }
        }

        loadStorageData();

        return() => { _isMounted = false }
    }, []);

    async function signIn(userName, password) {
        try {
            const { data } = await api.post('/auth/authenticate', { userName, password });

            setUser(data.user);
            api.defaults.headers.authorization = `Bearer ${data.token}`;

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
            showAlertError('Erro ao fazer login', err.response === undefined 
                ? 'Erro ao tentar conectar com o servidor. Tente novamente'
                : err.response.data.error 
            );
        }
    }

    function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null);
        });
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, user, setUser, signIn, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

