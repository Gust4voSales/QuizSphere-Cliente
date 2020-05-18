import React, { useContext, } from 'react';
import { View, FlatList, StyleSheet, ToastAndroid } from 'react-native';
import FriendInvitationCard from './components/FriendInvitationCard';
import UserActionsContext from '../../contexts/userActions';;
import api from '../../services/api';


export default function FriendInvitations() {
    const { friendInvitations, setFriendInvitations, } = useContext(UserActionsContext);

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
        setFriendInvitations(friendInvitations.filter(invitation => invitation.recipient!=recipientId));
    }

    return(
        <View style={styles.container}>
            <FlatList 
                style={{flex: 1}}
                data={friendInvitations}
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
    },

});