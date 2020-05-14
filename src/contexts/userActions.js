import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';

const UserActionsContext = createContext({ friendInvitations: [], notificationsCounter: 0 }); //value types 

export function UserActionsProvider({ children }) {
    let _isMounted = true;

    const { user, setUser } = useContext(AuthProvider);

    const [userId, setUserId] = useState(user._id);
    const [friendInvitations, setFriendInvitations] = useState([]);
    const [notificationsCounter, setNotificationsCounter] = useState(0);


    const socket = useMemo(() => socketio(api.defaults.baseURL, {
        query: { userId: user._id }
    }), [userId]);    

    useEffect(() => {
        socket.on('friend_invitation', data => {
            if (Array.isArray(data)) {
                if (_isMounted)
                setFriendInvitations([...data, ...friendInvitations]);
                setNotificationsCounter(oldCounter => oldCounter+data.length);
            }  // It's an array with pending invitations objects
            else {
                if (_isMounted)
                setFriendInvitations([data, ...friendInvitations]); // It's simply a new invitation object
                setNotificationsCounter(notificationsCounter+1);
            }
        });

        return () => { _isMounted=false }
    }, [friendInvitations, socket]);

    // useEffect(() => {
    //     console.log(friendInvitations);
    // }, [friendInvitations]);

    async function addFriend(userName) {
        const response = {};
        try {
            const { data } = await api.post(`/user/friend?userName=${userName}`);
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
            const { data } = await api.post(`/user/savedQuizzes/${quizId}`);
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
            const { data } = await api.delete(`/user/savedQuizzes/${quizId}`);
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
        <UserActionsContext.Provider value={{ 
            friendInvitations, 
            setFriendInvitations,
            notificationsCounter, 
            setNotificationsCounter, 
            addFriend, 
            saveQuiz, 
            removeQuizFromSavedQuizzes }}
        >
            {children}
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
