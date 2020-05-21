import React, { useContext, useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import FriendInvitationCard from './components/FriendInvitationCard';
import UserActionsContext from '../../contexts/userActions';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';


export default function FriendInvitations() {
    const { friendInvitations, setFriendInvitations, } = useContext(UserActionsContext);
    const [loading, setLoading] = useState(true);
    const [finishedFetching, setFinishedFetching] = useState(false);
    const [invitations, setInvitations] = useState([]);
   
    useEffect(() => {
        if (friendInvitations) {
            console.log('new');
            
            setInvitations([]);
            loadInvitations();
        }
    }, [friendInvitations]);

    useEffect(() => {
        loadInvitations();
    }, []);


    // useEffect(() => {
    //     if (!friendInvitations) // There are no new invitations just load the old ones
    //         loadInvitations();
    // }, []);

    // useEffect(() => {
    //     // New invitation received then refresh the component state
    //     if (friendInvitations) {
    //         setInvitations([]);
    //     }
    // }, [friendInvitations]);

    // useEffect(() => {
    //     // Load invitations after refreshing (refreshing happens when friendInvitations variable from context is set to true)
    //     if (friendInvitations && invitations.length===0)
    //         loadInvitations();

    // }, [invitations]);

    async function loadInvitations() {
        try {
            setLoading(true);

            const { data } = await api.get(`/user/friend/pendingInvitations`);
            
            setInvitations([...data.invitations, ...invitations]);
            setLoading(false);
        } catch (err) {
            console.log(err.response)
            setLoading(false);
            // setFinishedFetching(true);

        }
    }

     // Function called when we leave
     useFocusEffect(
        useCallback(() => {
            const unsubscribe = () => {
                setFriendInvitations(false);
            }

            return () => unsubscribe();
        }, [])
    );


    async function acceptFriendInvitationHandler(recipientId) {
        try {   
            const { data } = await api.post(`/user/friend/acceptInvitation/${recipientId}`);
            // console.log(data.user);
            removeInvitation(recipientId, data.message);
        } catch (err) {
            console.log(err);
            if (err.response)
                console.log(err.response.data.error);
        }
    }

    async function declineFriendInvitationHandler(recipientId) {
        try {   
            const { data } = await api.post(`/user/friend/declineInvitation/${recipientId}`);
            // console.log(data.user);
            removeInvitation(recipientId, data.message);
        } catch (err) {
            console.log(err);
            if (err.response)
                console.log(err.response.data.error);
        }
    }
    
    function removeInvitation(recipientId, feedbackMessage) {
        ToastAndroid.show(feedbackMessage, ToastAndroid.SHORT);
        setInvitations(invitations.filter(invitation => invitation.recipient!=recipientId));
    }

    if (loading) {
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white"/>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <FlatList 
                style={{flex: 1}}
                data={invitations}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <FriendInvitationCard 
                        data={item} 
                        acceptInvitation={recipientId => acceptFriendInvitationHandler(recipientId)} 
                        declineInvitation={recipientId => declineFriendInvitationHandler(recipientId)}
                    />
                )}
            />

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
    },

});