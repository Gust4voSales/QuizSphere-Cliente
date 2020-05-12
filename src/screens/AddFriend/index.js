import React, { useState, useContext, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Keyboard, TouchableWithoutFeedback } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Touchable from 'react-native-platform-touchable';
import UserActionsContext from '../../contexts/userActions';


export default function AddFriend() {
    const { addFriend } = useContext(UserActionsContext);
    const input = useRef(null);
    const [username, setUsername] = useState('');
    const [errorMessage, setError] = useState('');
    
    
    async function addFriendHandler() {
        Keyboard.dismiss();
        if (username.length<1) return;
        
        const response = await addFriend(username);

        if (!response.success) {
            setError(response.message);
            return;
        }
        input.current.clear();
        setError('');
        setUsername('');
    }

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LinearGradient style={styles.container} colors={['#364F6B', '#3E81A7']} >
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
                <Text style={styles.errorMessage}>{errorMessage}</Text>

                <Touchable style={styles.btn} onPress={addFriendHandler} background={Touchable.SelectableBackground()}>
                    <Text style={styles.textBtn}>Adicionar</Text>
                </Touchable>
         </LinearGradient>
        </TouchableWithoutFeedback>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        color: '#FF5454',
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