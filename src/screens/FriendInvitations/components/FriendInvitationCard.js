import React, { useEffect, useState, } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { systemWeights } from 'react-native-typography';
import api from '../../../services/api';


export default function FriendInvitation(props) {
    const [recipientName, setRecipientName] = useState('');    

    useEffect(() => {
        async function loadUserData() {
            try {
                const { data } = await api.get(`/user/${props.data.recipient}`);
                setRecipientName(data.user.userName);
            } catch(err) {
                console.log(err);
                // Message: couldn't load
            }
        }

        loadUserData();
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.username}>{recipientName}</Text>
                <Text> enviou uma solicitação de amizade.</Text>
            </View>
            
            <View style={styles.optionsContainer}>
                <Touchable onPress={() => props.acceptInvitation(props.data.recipient)} style={styles.btn} foreground={Touchable.SelectableBackground()}>
                    <Text style={styles.accept}>ACEITAR</Text>
                </Touchable>
                <Touchable onPress={() => props.declineInvitation(props.data.recipient)} style={styles.btn} foreground={Touchable.SelectableBackground()}>
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
        backgroundColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    header: {
        flexDirection:'row',
        // justifyContent: 'center',
        // alignSelf: 'flex-start',
        paddingLeft: 15,
        marginBottom: 10,
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
        ...systemWeights.semibold,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        backgroundColor: 'blue',
        borderRadius: 5,
    },  
    decline: {
        ...systemWeights.semibold,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: 'white',
        backgroundColor: 'red',
        borderRadius: 5,
    },

});