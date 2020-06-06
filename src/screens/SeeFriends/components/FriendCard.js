import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from 'react-native-platform-touchable';
import api from '../../../services/api';


export default function FriendCard({ friend, relationId, userFeedbackAfterPressing }) {
    const [loading, setLoading] = useState(false)

    async function removeFriend() {
        try {   
            setLoading(true);
            const { data } = await api.delete(`/user/friend/${relationId}`);
            // console.log(data.user);
            userFeedbackAfterPressing(relationId, data.message, true);
        } catch (err) {
            console.log(err);
            setLoading(false);
            userFeedbackAfterPressing(relationId, 'Não foi possível remover a amizade', false);
        }
    }

    return(
        <View style={styles.container}>
            <Text style={styles.user}>{friend}</Text>
            <Touchable 
                onPress={removeFriend} 
                style={styles.btn} 
                foreground={Touchable.SelectableBackground()}
                disabled={loading}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon name="account-remove" color="white" size={20}/>
                    <Text style={styles.remove}>Remover amigo</Text>
                </View>
            </Touchable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        // backgroundColor: '#ddd',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
    },
    user: {
        ...systemWeights.bold,
        paddingTop: 2,
        color: 'white',
        fontSize: 18,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#FF5454',
        borderRadius: 5,
    },
    remove: {
        ...systemWeights.bold,
        marginLeft: 10, 
        color: 'white',
    
    },

});