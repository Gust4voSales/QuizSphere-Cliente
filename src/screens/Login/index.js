import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';

import AuthContext from '../../contexts/auth';

export default function Login({ navigation }) {
    const { signIn } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    function handleSignIn() {
        signIn(userName, password);
    }

    return(
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                onChangeText={text => setUserName(text)}
                underlineColorAndroid="blue"
            />
            <TextInput 
                style={styles.input}
                onChangeText={text => setPassword(text)}
                
                underlineColorAndroid="blue"
            />

            <Touchable 
                onPress={handleSignIn}
                background={Touchable.SelectableBackground()}
            >
                <Text>Login</Text>
            </Touchable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: '70%',
        height: 35,
    },
});