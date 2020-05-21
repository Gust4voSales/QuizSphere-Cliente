import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';
import { set } from 'react-native-reanimated';

const UserActionsContext = createContext({ friendInvitations: false, notificationIndicator: false, newActivity: false }); //value types 
// const UserActionsContext = createContext({ friendInvitations: [], mentions: [], invitationsCounter: 0, mentionsCounter: 0 }); //value types 

export function UserActionsProvider({ children }) {
    let _isMounted = true;

    const { user, setUser } = useContext(AuthProvider);

    const [userId, setUserId] = useState(user._id);
    const [notificationIndicator, setNotificationIndicator] = useState(false);
    const [friendInvitations, setFriendInvitations] = useState(false);
    const [newActivity, setNewActivity] = useState(false);

    const socket = useMemo(() => socketio(api.defaults.baseURL, {
        query: { userId },
        'reconnection'        : true,
        'reconnectionDelay'   : 1000,
        'reconnectionAttempts': Infinity,
    }), [userId]);    


    useEffect(() => {
        socket.on('connect', () => {
            loadUserInfo();
        })
        socket.on('friend_invitation', () => {
            console.log('new invitations');
            
            setNotificationIndicator(true);
            setFriendInvitations(true);
        });

        socket.on('new_activity', () => {
            console.log('new activity');

            setNotificationIndicator(true);
            setNewActivity(true);
        });

    }, [friendInvitations, newActivity, socket]);
    
    async function loadUserInfo() {
        try {
            const { data: userData } = await api.get(`/user/${user._id}`);
            
            const { data } = await api.get('/user/notifications/info');
            
            setUser(userData.user);
            
            if (data.newNotifications){
                setNotificationIndicator(true);
            }
        } catch (err) {
            ToastAndroid.show('Não foi possível atualizar informações do usuário', ToastAndroid.SHORT);
        }
    }


    async function sendFriendInvitation(userName) {
        const response = {};
        try {
            const { data } = await api.post(`/user/friend?userName=${userName}`);

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
            notificationIndicator,
            setNotificationIndicator,
            newActivity, 
            setNewActivity ,
            sendFriendInvitation, 
            saveQuiz, 
            removeQuizFromSavedQuizzes }}
        >
            {children}
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
