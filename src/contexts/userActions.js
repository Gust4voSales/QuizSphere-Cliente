import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';
import { set } from 'react-native-reanimated';

const UserActionsContext = createContext({ friendInvitations: false, newActivity: false }); //value types 
// const UserActionsContext = createContext({ friendInvitations: [], mentions: [], invitationsCounter: 0, mentionsCounter: 0 }); //value types 

export function UserActionsProvider({ children }) {
    let _isMounted = true;

    const { user, setUser } = useContext(AuthProvider);

    const [userId, setUserId] = useState(user._id);
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
            
            setFriendInvitations(true);
        });

        socket.on('new_activity', () => {
            console.log('new activity');

            setNewActivity(true);
        });

        socket.on('reconnect', () => {
            console.log('sending id after reconnecting');
            
            socket.emit('reconnected', { userId });
        })

    }, [friendInvitations, newActivity, socket]);

    function disconnectSocket() {
        socket.disconnect();
    }
    
    async function loadUserInfo() {
        try {
            const { data } = await api.get(`/user/${user._id}`);
            
            setUser(data.user);
            
            if (data.newActivities) setNewActivity(true);
            if (data.pendingInvitations) setFriendInvitations(true);

        } catch (err) {
            if (err.response.data.user) setUser(err.response.data.user);
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
            response.success = false;
            
            if (err.response===undefined) {
                response.message = err.response.data.error;
                return response;
            }

            response.message = err.response.data.error;
            return response;
        }
    }

    async function addFavoriteQuiz(quizId) {
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

    async function removeFavoriteQuiz(quizId) {
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
            newActivity, 
            setNewActivity ,
            sendFriendInvitation, 
            addFavoriteQuiz, 
            removeFavoriteQuiz ,
            disconnectSocket,
            }}
        >
            {children}
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
