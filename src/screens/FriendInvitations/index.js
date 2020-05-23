import React, { useContext, useState, useEffect, } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid, ActivityIndicator, Text } from 'react-native';
import FriendInvitationCard from './components/FriendInvitationCard';
import UserActionsContext from '../../contexts/userActions';
import { useIsFocused } from '@react-navigation/native';
import api from '../../services/api';


export default function FriendInvitations() {
    const isTabFocused = useIsFocused();
    
    const { friendInvitations, setFriendInvitations, } = useContext(UserActionsContext);
    const [loading, setLoading] = useState(true);
    const [invitations, setInvitations] = useState([]);
   
    useEffect(() => {
        if (!friendInvitations) // There are no new invitations just load the old ones
            loadInvitations();
    }, []);

    useEffect(() => {
        // New invitation received then refresh the component state
        if (friendInvitations) {
            setInvitations([]);
            setLoading(false);
            // setPage(1);
            // setTotalPages(0);
        }
    }, [friendInvitations]);
    
    useEffect(() => {
        // Load invitations after refreshing (refreshing happens when friendInvitations variable from context is set to true)
        if (friendInvitations && invitations.length===0)
            loadInvitations();

    }, [invitations]);

    // Check if the tab is focused, if so setNewActivity will be equals false because the user is seeing his invitations
    useEffect(() => { 
        if (isTabFocused) setFriendInvitations(false);
    }, [isTabFocused, invitations]);


    async function loadInvitations() {
        try {
            setLoading(true);

            const { data } = await api.get(`/user/friend/pendingInvitations`);
            
            setInvitations([...data.invitations, ...invitations]);
            setLoading(false);
        } catch (err) {
            console.log(err.response)
            ToastAndroid.show('Não foi possível listar as solicitações de amizade.', ToastAndroid.SHORT);
            setLoading(false);
        }
    }

    
    function userFeedbackAfterPressing(recipientId, feedbackMessage, success) {
        ToastAndroid.show(feedbackMessage, ToastAndroid.SHORT);
        if (success) setInvitations(invitations.filter(invitation => invitation.recipient!=recipientId));
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
                        userFeedbackAfterPressing={userFeedbackAfterPressing}
                    />
                )}
            />
            {
            invitations.length===0 &&
            <Text style={styles.emptyInfoText}>Não há nada aqui 🙂</Text>
            }
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
    },
    emptyInfoText: {
        color: 'white',
        fontSize: 18,
        position: 'absolute',
        alignSelf: 'center',
        top: 5
    }
});