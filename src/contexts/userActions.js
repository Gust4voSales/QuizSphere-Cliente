import React, { createContext, useState, useEffect, useContext } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import api from '../services/api';

const UserActionsContext = createContext({}); //value types 

export function UserActionsProvider({ children }) {
    const { user, setUser } = useContext(AuthProvider);

    
    async function addFriend(userName) {
        const response = {};
        try {
            const { data } = await api.post(`/user/addFriend?userName=${userName}`);
            console.log(data);
            response.success = true;
            response.message = data.message;
            
            ToastAndroid.show(data.message, ToastAndroid.SHORT);
            return response;
        } catch (err) {
            if (err.response===undefined) {
                showAlertError('', 'Erro ao tentar conectar com o servidor. Tente novamente');
                return;
            }

            response.success = false;
            response.message = err.response.data.error;
            
            return response;
        }
    }

    async function saveQuiz(quizId) {
        try {
            const { data } = await api.put('/user/quiz/', { quizId, });
            setUser(data.user);

            ToastAndroid.show(data.message, ToastAndroid.SHORT);
        } catch(err) {
            console.log(err);
            showAlertError('', err.response === undefined 
                ? 'Erro ao tentar conectar com o servidor. Tente novamente'
                : err.response.data.error 
            );
        }
    }    

    async function removeQuizFromSavedQuizzes(quizId) {
        try {
            const { data } = await api.delete(`/user/quiz/${quizId}`);
            setUser(data.user);

            ToastAndroid.show(data.message, ToastAndroid.SHORT);
        } catch(err) {
            console.log(err);
            showAlertError('', err.response === undefined 
                ? 'Erro ao tentar conectar com o servidor. Tente novamente'
                : err.response.data.error 
            );
        }
    }   

    return(
        <UserActionsContext.Provider value={{ addFriend, saveQuiz, removeQuizFromSavedQuizzes }}>
            {children}
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
