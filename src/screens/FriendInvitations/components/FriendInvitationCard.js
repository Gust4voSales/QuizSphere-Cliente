import React, { useEffect, useState, } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { systemWeights } from 'react-native-typography';
import api from '../../../services/api';


export default function FriendInvitation(props) {
    const [recipientName, setRecipientName] = useState('');    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadUserData() {
            try {
                const { data } = await api.get(`/user/${props.data.recipient}`);
                setRecipientName(data.user.userName);
            } catch(err) {
                console.log(err);
                ToastAndroid.show('Não foi possível receber informações do usuário', ToastAndroid.SHORT);
                // Message: couldn't load
            }
        }

        loadUserData();
    }, []);

    async function acceptFriendInvitationHandler() {
        try {   
            setLoading(true);
            const { data } = await api.post(`/user/friend/acceptInvitation/${props.data.recipient}`);
            // console.log(data.user);
            props.userFeedbackAfterPressing(props.data.recipient, data.message, true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            props.userFeedbackAfterPressing(props.data.recipient, 'Não foi possível responder a solicitação', false);
        }
    }

    async function declineFriendInvitationHandler() {
        try {   
            setLoading(true);
            const { data } = await api.post(`/user/friend/declineInvitation/${props.data.recipient}`);
            // console.log(data.user);
            props.userFeedbackAfterPressing(props.data.recipient, data.message, true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            props.userFeedbackAfterPressing(props.data.recipient, 'Não foi possível responder a solicitação', false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.textInfo}>
                <Text style={styles.username}>{recipientName}</Text> enviou uma solicitação de amizade.
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