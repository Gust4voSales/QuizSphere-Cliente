import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback, ToastAndroid } from 'react-native';
import Header from '../../components/Header';
import Touchable from 'react-native-platform-touchable';
import UserActionsContext from '../../contexts/userActions';
import { useFocusEffect } from '@react-navigation/native';

export default function AddFriend({ navigation }) {
    const { sendFriendInvitation } = useContext(UserActionsContext);
    const input = useRef(null);
    const [username, setUsername] = useState('');
    const [errorMessage, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // When user leaves screen, clean up everything
    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe = () => {
                    setUsername('');
                    setError('');
                    input.current.clear();
            }

            return () => unsubscribe();
        }, [])
    );

    async function addFriendHandler() {
        Keyboard.dismiss();
        if (username.length<1) return;
        
        setLoading(true);
        try {
            const response = await sendFriendInvitation(username);

            if (!response.success) {
                setError(response.message);
                setLoading(false);
                return;
            }
            input.current.clear();
            setError('');
            setUsername('');
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false);
            ToastAndroid.show('Não foi possível enviar solicitação de amizade', ToastAndroid.SHORT);
        }
        
    }

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

        <View style={styles.container}>
                <Header screenTitle="Adicionar amigos"/>
                <TextInput 
                    style={styles.input}
                    maxLength={22}
                    ref={input}
                    onChangeText={text => {
                        setUsername(text.trim().toLowerCase())
                    }}
                    underlineColorAndroid="#58AAFF"
                    placeholder="Nome de usuário"
                    placeholderTextColor="#ddd"
                />
                { errorMessage.length>0 &&
                    <Text style={styles.errorMessage}>{errorMessage}</Text>}

                <Touchable style={styles.btn} onPress={addFriendHandler} background={Touchable.SelectableBackground()} disabled={loading}>
                    <Text style={styles.textBtn}>Adicionar</Text>
                </Touchable>
         </View>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#3D6F95',
    },
    input: {
        width: '97%',
        color: '#f9f9f9',
        paddingLeft: 10,
        paddingBottom: 8,
        fontSize: 18,
    },
    errorMessage: {
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#FF5454',
        color: 'white',
        paddingHorizontal: 8, 
        maxWidth: '95%',
        paddingVertical: 5,

        borderRadius: 4,
    },
    btn: {
        backgroundColor: '#f9f9f9',
        marginTop: '30%',
        paddingVertical: 15,
        width: '95%',
        borderRadius: 5,
    }, 
    textBtn: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#06A3FF',
        fontSize: 16,
    },
});