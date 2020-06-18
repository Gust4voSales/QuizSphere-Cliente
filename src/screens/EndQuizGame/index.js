import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, ToastAndroid, } from 'react-native';
import { StackActions, useFocusEffect, CommonActions } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RectButton } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { systemWeights } from 'react-native-typography';
import smileyAnimation from '../../assets/smileyAnimation.json';


export default function EndQuizGame({ route, navigation }) {
    const { quiz, timeout, correctAnswers, answeredQuestions } = route.params;
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = useState(0);
    
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
    
    // Count wrong answers, blanck ansers and show initial message if the timer runned out
    useEffect(() => {
        for (let answeredQuestion of answeredQuestions) {
            if (answeredQuestion.userAnswer!==answeredQuestion.correctAnswer)
                setWrongAnswers(oldCounter => oldCounter+1);
        } 
        setUnansweredQuestions(quiz.questions.length-answeredQuestions.length);

        if (timeout)
            ToastAndroid.showWithGravity('Tempo acabou!', ToastAndroid.LONG, ToastAndroid.CENTER);
    }, []);

    function playAgain() {
        // Removes the screen used in the last game and this actual screen from the route state 
        navigation.dispatch(state => {
            const routes = state.routes.filter(r => (r.name !== 'PlayQuiz') && (r.name !== 'EndQuizGame'));
            // console.log(routes);
            
            return CommonActions.reset({
              ...state,
              index: routes.length - 1,
              routes,
            });
        });

        // Navigates to the same PlayQuiz game but it'll be like it was the first time since it was removed from state
        navigation.navigate('PlayQuiz', { quiz });
    }

    function goBack() {
        const popAction = StackActions.pop(2);

        navigation.dispatch(popAction);
    }

    return(
        <LinearGradient colors={['#38506B', '#3E81A7']} style={styles.container}>
            <Text style={styles.title}>{quiz.quizTitle}</Text>
            <View style={styles.scoreContainer}>
                <Text style={styles.scoreTitle}>PONTUAÇÃO</Text>

                <View style={[styles.scoreFieldContainer, { marginTop: 30, backgroundColor: '#13F4A3' }]}>
                    <Text style={styles.scoreText}>Respostas corretas: </Text> 
                    <Text style={[ styles.scoreResult, {backgroundColor: '#13F4A3'} ]}>{correctAnswers}</Text>
                </View>
                <View style={[styles.scoreFieldContainer, { backgroundColor: '#FF5454' }]}>
                    <Text style={styles.scoreText}>Respostas incorretas: </Text> 
                    <Text style={[ styles.scoreResult, {backgroundColor: '#FF5454'} ]}>{wrongAnswers}</Text>
                </View>
                <View style={[styles.scoreFieldContainer, { marginBottom: 0, backgroundColor: '#DFF2FF' }]}>
                    <Text style={styles.scoreText}>Respostas em branco: </Text> 
                    <Text style={[ styles.scoreResult ]}>{unansweredQuestions}</Text>
                </View>
            </View>
            <View style={styles.btnContainer}>
                <RectButton style={[styles.btn, { backgroundColor: '#0078F4' }]} onPress={playAgain}>
                    <Icon name="refresh" color="white" size={30}/>
                    <Text style={[styles.btnText, {color: 'white'}]}>Jogar novamente</Text>
                </RectButton>
                <RectButton style={[styles.btn, { backgroundColor: 'white' }]} onPress={goBack}>
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