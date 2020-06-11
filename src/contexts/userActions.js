import React, { createContext, useState, useEffect, useContext, useMemo, useRef } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';
import { set } from 'react-native-reanimated';

const UserActionsContext = createContext({ friendInvitations: false, newActivity: false }); //value types 
// const UserActionsContext = createContext({ friendInvitations: [], mentions: [], invitationsCounter: 0, mentionsCounter: 0 }); //value types 

export function UserActionsProvider({ children }) {
    const isMounted = useRef();

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
        isMounted.current = true;
        return () => { isMounted.current = false }
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            loadUserInfo();
        })
        socket.on('friend_invitation', () => {
            console.log('new invitations');
            if (isMounted.current)
                setFriendInvitations(true);
        });

        socket.on('new_activity', () => {
            console.log('new activity');
            if (isMounted.current)
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
            
            if (isMounted.current) {
                setUser(data.user);
            
                if (data.newActivities) 
                    setNewActivity(true);
                if (data.pendingInvitations) 
                    setFriendInvitations(true);
            }
            

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

    async function likeQuiz(quizId) {
        try {
            await api.post(`/quiz/${quizId}/like`);

            return true;
        } catch (err) {
            ToastAndroid.show('Não foi possível dar like no quiz', ToastAndroid.SHORT);
            return false;            
        }
    }
    
    async function deslikeQuiz(quizId) {
        try {
            await api.delete(`/quiz/${quizId}/deslike`);

            return true;
        } catch (err) {
            ToastAndroid.show('Não foi possível dar deslike no quiz', ToastAndroid.SHORT);
            return false;            
        }
    }

    async function addFavoriteQuiz(quizId) {
        try {
            const { data } = await api.post(`/user/savedQuizzes/${quizId}`);
            if (isMounted.current)
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
            if (isMounted.current)
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

    async function shareQuiz(quizId, friendsIds) {
        try {
            await api.post(`/user/shareQuiz/${quizId}`, {friendsIds, userName: user.userName});
        } catch (err) {
            console.log(err);
            ToastAndroid.show('Ocorreu um erro ao compartilhar o quiz', ToastAndroid.SHORT);
        }
        
    }

    return(
        <UserActionsContext.Provider value={{ 
            friendInvitations, 
            setFriendInvitations,
            newActivity, 
            setNewActivity ,
            sendFriendInvitation, 
            likeQuiz,
            deslikeQuiz,
            addFavoriteQuiz, 
            removeFavoriteQuiz,
            shareQuiz,
            disconnectSocket,
            }}
        >
            {children}
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
