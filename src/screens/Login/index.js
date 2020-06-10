import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import { View, TextInput, StyleSheet, Text, Image, TouchableWithoutFeedback, Keyboard, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { RectButton } from 'react-native-gesture-handler';
import { systemWeights } from 'react-native-typography';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';


export default function Login({ navigation }) {
    const { signIn } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const passwdRef = useRef();
    const [seePassword, setSeePassword] = useState(false);
    const [logoImgSize, setLogoImgSize] = useState(220);
    const [logoImgMargin, setLogoImgMargin] = useState('-40%');
    const [backgroundSize, setBackgroundSize] = useState('74%');
    
    useFocusEffect(
        useCallback(() => {
            Keyboard.addListener("keyboardDidShow", keyboardOpenedHandler);
            Keyboard.addListener("keyboardDidHide", keyboardClosedHandler);
        
            // cleanup function
            return () => {
                Keyboard.removeListener("keyboardDidShow", keyboardOpenedHandler);
                Keyboard.removeListener("keyboardDidHide", keyboardClosedHandler);
            };
        }, [])
    );
    
    function handleSignIn() {
        signIn(userName, password);
    }
    
    function toggleSeePassword() {
        setSeePassword(!seePassword);
    }

    function keyboardOpenedHandler() {
        setBackgroundSize('90%');
        setLogoImgMargin('-17%');
        setLogoImgSize(100);
        // setBackgroundSize('84%');
        // setLogoImgMargin(-100);
        // setLogoImgSize(140);
    }
    
    function keyboardClosedHandler() {
        setBackgroundSize('74%');
        setLogoImgMargin('-40%');
        setLogoImgSize(220);
    }

    return(
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
            <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#E9E9E9'}}>
            <StatusBar backgroundColor="#E9E9E9" barStyle='dark-content' />
            <LinearGradient colors={["#364F6B", "#3E81A7"]} style={[styles.container, { height: backgroundSize }]}>
                <Image 
                    source={require('../../assets/logo.png')} 
                    style={[styles.logo, { height: logoImgSize+10, width: logoImgSize, marginTop: logoImgMargin }]} 
                />
                <Text style={styles.loginTxt}>LOGIN</Text>

                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Icon name="account" color="white" size={25} style={{position: 'absolute', left: 42, paddingBottom: 2 }}/>
                    <TextInput 
                        style={styles.input}
                        placeholder="Nome de usuário"
                        placeholderTextColor="#BBB"
                        onChangeText={text => setUserName(text)}
                        returnKeyType="next"
                        onSubmitEditing={() => {passwdRef.current.focus()}}
                        blurOnSubmit={false}
                        underlineColorAndroid="#06A3FF"
                    />
                </View>

                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    <Icon name="lock" color="white" size={25} style={{position: 'absolute', left: 42, paddingBottom: 2 }}/>
                    <TextInput 
                        style={[styles.input, { paddingRight: 34 }]}
                        placeholder="Senha"
                        secureTextEntry={!seePassword}
                        placeholderTextColor="#BBB"
                        onChangeText={text => setPassword(text)}
                        returnKeyType="done"
                        ref={passwdRef}
                        onSubmitEditing={handleSignIn}
                        underlineColorAndroid="#06A3FF"
                    />  
                    <TouchableWithoutFeedback onPress={toggleSeePassword}>
                        <Icon name={seePassword ? "eye" : "eye-off"} color="white" size={25} style={{position: 'absolute', right: 46, paddingBottom: 2 }}/>
                    </TouchableWithoutFeedback>
                </View>

                <RectButton 
                    onPress={handleSignIn} 
                    style={[styles.btn, { backgroundColor: '#06A3FF', marginTop: 30, opacity: userName&&password ? 1 : .7 }]}
                    enabled={!!(userName&&password)}
                >
                    <Text style={styles.txtBtn}>Login</Text>
                </RectButton>
                <RectButton 
                    onPress={() => {}} 
                    style={[styles.btn, { backgroundColor: 'white', opacity: userName&&password ? 1 : .7 }]}
                    enabled={!!(userName&&password)}
                >
                    <Text style={[styles.txtBtn, { color: '#06A3FF' }]}>Registrar</Text>
                </RectButton >
            </LinearGradient>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        // justifyContent: 'center',
    },
    logo: {
        height: 230,
        width: 220,
        // backgroundColor: '#ddd',
    },
    loginTxt: {
        color: 'white',
        ...systemWeights.bold,
        fontSize: 24,
        letterSpacing: 2,
        marginTop: 10,
        marginBottom: 15,
    },
    input: {
        width: '80%',
        fontSize: 16,
        color: 'white',
        paddingLeft: 34,
    },
    btn: {
        width: '78%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 2,
        marginBottom: 20,
    },
    txtBtn: {
        ...systemWeights.semibold,
        fontSize: 20, 
        paddingVertical: 15,
        color: 'white',
        letterSpacing: .7,
    },
});