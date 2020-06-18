import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, } from 'react-native';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { systemWeights } from 'react-native-typography';
import smileyAnimation from '../../assets/smileyAnimation.json';


export default function EndQuizGame({ route, navigation }) {
    const { quiz, timeout, correctAnswers, answeredQuestions } = route.params;

    console.log('Tempo acabou? ', timeout);
    console.log('Corretas Total: ', correctAnswers);
    console.log('Respondidadas no Total: ', answeredQuestions);
    
    // Custom BackButton behavior
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const popAction = StackActions.pop(2);

                navigation.dispatch(popAction);
                return true;
            };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    
    // Count correct answers, 
    useEffect(() => {}, [
        
    ]);

    return(
        <LinearGradient colors={['#38506B', '#3E81A7']} style={styles.container}>
            <Text style={styles.title}>{quiz.quizTitle}</Text>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>PONTUAÇÃO</Text>

                <View style={[styles.scoreFieldContainer, { marginTop: 30, backgroundColor: '#13F4A3' }]}>
                    <Text style={[styles.scoreText]}>Respostas corretas: </Text> 
                    <Text style={[ styles.scoreResult, {backgroundColor: '#13F4A3'} ]}>{14}</Text>
                </View>
                <View style={[styles.scoreFieldContainer, { backgroundColor: '#FF5454' }]}>
                    <Text style={[styles.scoreText]}>Respostas incorretas: </Text> 
                    <Text style={[ styles.scoreResult, {backgroundColor: '#FF5454'} ]}>{2}</Text>
                </View>
                <View style={[styles.scoreFieldContainer, { marginBottom: 0, backgroundColor: '#DFF2FF' }]}>
                    <Text style={[styles.scoreText]}>Respostas em branco: </Text> 
                    <Text style={[ styles.scoreResult ]}>{1}</Text>
                </View>
            </View>
            <View style={styles.btnContainer}>
                <RectButton style={[styles.btn, { backgroundColor: '#0078F4' }]}>
                    <Icon name="refresh" color="white" size={30}/>
                    <Text style={[styles.btnText, {color: 'white'}]}>Jogar novamente</Text>
                </RectButton>
                <RectButton style={[styles.btn, { backgroundColor: 'white' }]}>
                    <Icon name="chevron-left" color="#0078F4" size={30}/>
                    <Text style={[styles.btnText, {color: '#0078F4', marginLeft: 4}]}>Voltar</Text>
                </RectButton>
            </View>
            <LottieView
                source={smileyAnimation}
                style={styles.animation}
                autoPlay
                loop
                useNativeDriver
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        width: '100%',
        fontSize: 26,
        color: 'white',
        ...systemWeights.semibold,
        textAlign: 'center',
        paddingVertical: 15,
    },
    scoreContainer: {
        width: '80%',
        paddingVertical: 20,
        marginTop: 20,
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#3D6F95',
        elevation: 3,
        // alignItems: 'center',
    }, 
    scoreTitle: {
        position: 'absolute',
        top: 10,
        fontSize: 18,
        color: '#fff',
        ...systemWeights.bold,
        alignSelf: 'center',
    },
    scoreFieldContainer: {
        width: '90%',
        flexDirection: 'row', 
        marginBottom: 5,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 2,
    },
    scoreText: {
        fontSize: 16,
        color: '#162F48',
        textAlignVertical: 'center',
        ...systemWeights.semibold,
        paddingTop: 2,
        alignSelf: 'flex-start',
    },
    scoreResult: {
        fontSize: 16,
        color: '#162F48',
    },
    btnContainer: {
        position :'absolute',
        bottom: 50,
        height: 130,
        width: '80%',
        justifyContent: 'space-between',
        // backgroundColor: 'pink'
    },
    btn: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        marginLeft: 10,
        fontSize: 18,
        ...systemWeights.semibold,
        paddingTop: 2,
    },
    animation: {
        position: 'absolute',
        top: 150,
        height: 100, 
        width: 100,
        // backgroundColor: '#ddd'
    },
});