import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import showAlertError from '../components/AlertError';
import AuthProvider from '../contexts/auth';
import socketio from 'socket.io-client';
import api from '../services/api';

const UserActionsContext = createContext({ friendInvitations: [], notificationIndicator: false, newActivity: false }); //value types 
// const UserActionsContext = createContext({ friendInvitations: [], mentions: [], invitationsCounter: 0, mentionsCounter: 0 }); //value types 

export function UserActionsProvider({ children }) {
    let _isMounted = true;

    const { user, setUser } = useContext(AuthProvider);

    const [friendInvitations, setFriendInvitations] = useState([]);
    const [notificationIndicator, setNotificationIndicator] = useState(false);
    const [newActivity, setNewActivity] = useState(false);

    const socket = useMemo(() => socketio(api.defaults.baseURL, {
        query: { userId: user._id }
    }), [user]);    

    useEffect(() => {
        async function loadMentions() {
            try {
                const { data } = await api.get('/user/notifications/info');

                if (data.newActivities){
                    setNotificationIndicator(true);
                }
            } catch (err) {
                console.log(err);
            }
               
        }

        loadMentions();
    }, []);

    useEffect(() => {
        socket.on('friend_invitation', data => {
            if (Array.isArray(data)) {
                if (_isMounted)
                    setFriendInvitations([...data, ...friendInvitations]); // It's an array with pending invitations objects that is sent by the serve whenever the user connects
                if (data.length>0) 
                    setNotificationIndicator(true);
            }  
            else {
                if (_isMounted)
                    setFriendInvitations([data, ...friendInvitations]); // It's simply a new invitation object
                setNotificationIndicator(true);
            }

        });

        socket.on('new_activity', data => {
            setNotificationIndicator(true);
            setNewActivity(true);
        });

        return () => { _isMounted=false }
    }, [friendInvitations]);

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
