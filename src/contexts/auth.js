import React, { createContext, useState, useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import showAlertError from '../components/AlertError';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api';


const AuthContext = createContext({ signed: false, user: {}, loading: true }); //value types 

export function AuthProvider({ children }) {
    // const isMounted = useRef();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // isMounted.current = true;
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
        setInterceptorResponseOnApi();

        loadStorageData();

        // return() => { isMounted.current = false }
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
            showAlertError('Não foi possível realizar login', err.response === undefined 
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

    // This function set a response interceptor at the api, so on each request if the response === 401 (token not valid, probably expired)
    // the user is logged out, this behavior could be replaced by a refresh token system...
    function setInterceptorResponseOnApi() {
        api.interceptors.response.use(res => res, err => {
            if (!err.response) {
                return new Promise((resolve, reject) => {
                    reject(err);
                });
            } else if (err.response.status !== 401) {
                return new Promise((resolve, reject) => {
                  reject(err);
                });
            } else if (err.response.status === 401) { // TOKEN EXPIRED OR TOKEN NOT ALLOWED. EITHER ONE OF THE OPTIONS, USER SHOULD BE LOGGED OUT
                signOut();
            }
        });
    }

    return(
        <AuthContext.Provider value={{ signed: !!user, user, setUser, signIn, signOut, loading }}>
            <StatusBar backgroundColor="#314C6A" barStyle='light-content' />
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;

