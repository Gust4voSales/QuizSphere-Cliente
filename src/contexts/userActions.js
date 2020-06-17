import React, { createContext, useState, useEffect, useContext, useMemo, useRef } from 'react';
import { ToastAndroid } from 'react-native';
import FlashMessage, { showMessage } from "react-native-flash-message";
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';

const UserActionsContext = createContext({ friendInvitations: false, newActivity: false }); //value types 

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
            if (isMounted.current) {
                setFriendInvitations(true);
                showNotification("Você recebeu uma solicitação de amizade");
            }   
        });

        socket.on('new_activity', (info) => {
            console.log(info); // type: solicitation or shared
            if (isMounted.current) {
                setNewActivity(true);
                showNotification(
                    info.type==='solicitation'
                    ? 'Sua solicitação de amizade foi aceita'
                    : 'Um amigo compartilhou um quiz com você'
                );
            }
        });

        socket.on('reconnect', () => {
            console.log('sending id after reconnecting');
            
            socket.emit('reconnected', { userId });
        });

    }, [friendInvitations, newActivity, socket]);

    function disconnectSocket() {
        socket.disconnect();
    }
    
    async function loadUserInfo() {
        try {
            const { data } = await api.get(`/user/${user._id}`);
            
            if (isMounted.current) {
                setUser(data.user);
            
                if (data.newActivities) {
                    setNewActivity(true);
                    showNotification('Você tem notificações não vistas');
                }
                if (data.pendingInvitations) {
                    setFriendInvitations(true);
                    showNotification('Você tem solicitações de amizade pendente');
                }
            }
            

        } catch (err) {
            ToastAndroid.show('Não foi possível atualizar informações do usuário', ToastAndroid.SHORT);
        }
    }

    function showNotification(message) {
        showMessage({
            message,
            type: "info",
            backgroundColor: "#314C6A", // background color
            color: "#fff", // text color
        });
    }

// --------------------------------ACTIONS------------------------------------

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
            ToastAndroid.show('Não foi possível salvar o quiz', ToastAndroid.SHORT);
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
            ToastAndroid.show('Não foi possível remover o quiz dos favoritos', ToastAndroid.SHORT);

        }
    }   

    async function shareQuiz(quizId, friendsIds) {
        try {
            await api.post(`/shareQuiz/${quizId}`, {friendsIds, userName: user.userName});
            ToastAndroid.show('Quiz compartilhado', ToastAndroid.SHORT);
        } catch (err) {
            console.log(err);
            if (err.response === undefined) {
                ToastAndroid.show('Ocorreu um erro ao compartilhar o quiz', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(err.response.data.error, ToastAndroid.SHORT);
            }
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
            <FlashMessage duration={2500} icon="auto"/>
        </UserActionsContext.Provider>
    );
}

export default UserActionsContext;
