import React, { useEffect, useState, } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { systemWeights } from 'react-native-typography';
import api from '../../../services/api';


export default function FriendInvitation({ user, userFeedbackAfterPressing }) {
    const [loading, setLoading] = useState(false);


    async function acceptFriendInvitationHandler() {
        try {   
            setLoading(true);
            const { data } = await api.post(`/user/friend/acceptInvitation/${user.recipient._id}`);

            userFeedbackAfterPressing(user.recipient._id, data.message, true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            userFeedbackAfterPressing(user.recipient._id, 'Não foi possível responder a solicitação', false);
        }
    }

    async function declineFriendInvitationHandler() {
        try {   
            setLoading(true);
            const { data } = await api.post(`/user/friend/declineInvitation/${user.recipient._id}`);
            // console.log(data.user);
            userFeedbackAfterPressing(user.recipient._id, data.message, true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            userFeedbackAfterPressing(user.recipient._id, 'Não foi possível responder a solicitação', false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.textInfo}>
                <Text style={styles.username}>{user.recipient.userName}</Text> enviou uma solicitação de amizade.
            </Text>
            
            <View style={styles.optionsContainer}>
                <Touchable 
                    onPress={acceptFriendInvitationHandler} 
                    style={styles.btn} 
                    foreground={Touchable.SelectableBackground()}
                    disabled={loading}
                >
                    <Text style={styles.accept}>ACEITAR</Text>
                </Touchable>
                <Touchable 
                    onPress={declineFriendInvitationHandler} 
                    style={styles.btn} 
                    foreground={Touchable.SelectableBackground()}
                    disabled={loading}
                >
                    <Text style={styles.decline}>RECUSAR</Text>
                </Touchable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 90,
        width: '100%',
        // backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#fff',
    },
    textInfo: {
        // paddingLeft: 10,
        color: 'white',
        fontSize: 18,
    },
    username: {
        ...systemWeights.bold,
        paddingTop: 2,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'space-around',
    },
    accept: {
        ...systemWeights.bold,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        backgroundColor: '#00A3FF',
        borderRadius: 5,
    },  
    decline: {
        ...systemWeights.bold,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        backgroundColor: '#FF5454',
        borderRadius: 5,
    },

});