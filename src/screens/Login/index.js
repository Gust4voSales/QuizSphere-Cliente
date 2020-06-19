import React, { useState, useContext, useEffect, useCallback, useRef } from 'react';
import logo from '../../assets/logo.png'
import { View, TextInput, Text, Image, TouchableWithoutFeedback, Keyboard, StatusBar, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { RectButton } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import styles from './styles';


export default function Login({ navigation }) {
    const isMounted = useRef();
    const passwdRef = useRef();
    const { signIn, register } = useContext(AuthContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [loadingLogin, setLoadingLogin] = useState(false);
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [seePassword, setSeePassword] = useState(false);
    const [logoImgHeight, setLogoImgHeight] = useState(230);
    const [logoImgWidth, setLogoImgWidth] = useState(230);
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

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false }
    }, []);
    
    async function handleSignIn() {
        setErrorMsg('');
        setLoadingLogin(true);
        const error = await signIn(userName, password);

        if (isMounted.current) {
            setLoadingLogin(false);
            setErrorMsg(error);
        }
    }
    
    async function handleRegistration() {
        setErrorMsg('');
        setLoadingRegister(true);
        const error = await register(userName, password);

        if (isMounted.current) {
            setLoadingRegister(false);
            setErrorMsg(error);
        }
    }
    
    function toggleSeePassword() {
        setSeePassword(!seePassword);
    }

    function keyboardOpenedHandler() {
        setBackgroundSize('90%');
        setLogoImgMargin('-17%');
        setLogoImgHeight(110);
        setLogoImgWidth(120);
    }
    
    function keyboardClosedHandler() {
        setBackgroundSize('74%');
        setLogoImgMargin('-40%');
        setLogoImgHeight(230);
        setLogoImgWidth(230);
    }

    return(
        <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
            <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#E9E9E9'}}>
            <StatusBar backgroundColor="#E9E9E9" barStyle='dark-content' />
            <LinearGradient colors={["#364F6B", "#3E81A7"]} style={[styles.container, { height: backgroundSize }]}>
                <Image 
                    source={logo} 
                    style={{ height: logoImgHeight+10, width: logoImgWidth-10, marginTop: logoImgMargin, }} 
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
                        autoCompleteType="username"
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
                        autoCompleteType="password"
                        autoCapitalize="none"
                        underlineColorAndroid="#06A3FF"
                    />  
                    <TouchableWithoutFeedback onPress={toggleSeePassword}>
                        <Icon name={seePassword ? "eye" : "eye-off"} color="white" size={25} style={{position: 'absolute', right: 46, paddingBottom: 2 }}/>
                    </TouchableWithoutFeedback>
                </View>

                { !!errorMsg &&
                    <Text style={styles.errorMessage}>{errorMsg}</Text>
                }

                <RectButton 
                    onPress={handleSignIn} 
                    style={[styles.btn, { backgroundColor: '#06A3FF', marginTop: 15, opacity: userName&&password ? 1 : .7 }]}
                    enabled={!!(userName&&password) && !(loadingLogin||loadingRegister)}
                >
                    {
                        loadingLogin 
                        ? <ActivityIndicator size="large" color="white" /> 
                        : <Text style={styles.txtBtn}>Login</Text>
                    }
                </RectButton>
                <RectButton 
                    onPress={handleRegistration} 
                    style={[styles.btn, { backgroundColor: 'white', opacity: userName&&password ? 1 : .7 }]}
                    enabled={!!(userName&&password) && !(loadingLogin||loadingRegister)}
                >
                    {
                        loadingRegister 
                        ? <ActivityIndicator size="large" color="#06A3FF" /> 
                        : <Text style={[styles.txtBtn, { color: '#06A3FF' }]}>Registrar</Text>
                    }
                </RectButton >
            </LinearGradient>
            </View>
        </TouchableWithoutFeedback>
    );
}

