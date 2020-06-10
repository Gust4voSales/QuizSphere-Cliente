import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ImageBackground, Alert, StatusBar, Dimensions, StyleSheet } from 'react-native';
import PlayQuizContext from '../../contexts/playQuiz';
import ProgressBar from 'react-native-progress/Bar';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import QuestionsList from './components/QuestionsList';
import Option from './components/Option';

import data from './utils/Mock'; // Remove later
import moment from 'moment';
import styles from './styles';


const AnimatableLinear = Animatable.createAnimatableComponent(LinearGradient);
const screenWidth = Math.round(Dimensions.get('window').width);
let startGameTimer;
export default function PlayQuiz({ route, navigation }) {
    const scroll = useRef(null);
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    // const [quiz, setQuiz] = useState(route.params.quiz); //Quiz with all the data
    const [quiz, setQuiz] = useState(data.quiz); //Quiz with all the data

    const [questionIndex, setQuestionIndex] = useState(0); // The question index from the actual question
    const [questionTitle, setQuestionTitle] = useState(''); // The actual question asked
    const [options, setOptions] = useState([]); // The actual available options
    const [correctAnswers, setCorrectAnswers] = useState(0); // Counter with the correct answers 
    
    const [progress, setProgress] = useState(-1);
    const [animation, setAnimation] = useState(null);
    const [questionFontSize, setFontSize] = useState(22) // Fontsize configs
   
    useEffect(() => {
        startGameTimer = null;
        showStartMessage()
    }, []);

    useEffect(() => {
        const actualQuestion = quiz.questions[questionIndex];
        
        setQuestionTitle(actualQuestion.questionTitle);
        setOptions(actualQuestion.options);
    }, [questionIndex]);

    useEffect(() => {        
        if(questionTitle.length > 100) setFontSize(16);
        else if(questionTitle.length > 60) setFontSize(18);
        else setFontSize(24);
    }, [questionTitle]);

    // QUIZ TIMER 
    useEffect(() => {
        if (!startGameTimer) return; // Game has not been started yet
        let intervalTimer = null;

        if (progress<1) {
            intervalTimer = setInterval(() => {
                const now = moment();
                const quizTimerInSecs = quiz.time*60;

                const secsSinceGameStarted = now.diff(startGameTimer, 'seconds');
                
                setProgress(secsSinceGameStarted/quizTimerInSecs); // Time passed percentual 
            }, 1000);
        } else {
            clearInterval(intervalTimer);
            finishQuiz(true); // Finishing game by timeout
        }

        return () => clearInterval(intervalTimer);
    }, [startGameTimer, progress]);

    // Create card messaage component later
    function showStartMessage() {
        Alert.alert(
            'Iniciar o quiz',
            `Você tem ${quiz.time} minutos para responder ${quiz.questions.length} questões!`,
            [{ text: 'INICIAR', onPress: startGame }]    
        );
    }

    function startGame() {
        startGameTimer = moment();
        setProgress(0);
        console.log('Start Timer: ', startGameTimer.toLocaleString());
    
    }

    function updateQuestion() {
        if (questionIndex===quiz.questionsLength-1) {
            finishQuiz();
            return;
        }
        
        setQuestionIndex(questionIndex => questionIndex+1);
    }

    function onFinishAnimation(endState) {
        // After the user's selection animation ends it's time to call the next question 
        if(endState) { 
            setAnimation(null);
            scroll.current.scrollToIndex({
                index: questionIndex,
                viewOffset: 10,
            });
            updateQuestion();
        }
    }

    function finishQuiz(timeout = false) {
        console.log('acabou');
        Alert.alert(
            '',
            `${timeout && 'Tempo acabou. \n'} 
                PONTUAÇÂO: ${correctAnswers}/${quiz.questionsLength}`,
            [
                { text: 'Retornar', onPress: () => navigation.goBack() },
            ]
        );
    }


    return(
        <PlayQuizContext.Provider value={{ quiz, questionIndex, setQuestionIndex, options, answeredQuestions, setAnsweredQuestions, setCorrectAnswers, setAnimation }}>
        <StatusBar backgroundColor="#37506C" barStyle='light-content' />
        <AnimatableLinear 
            colors={['#38506B', '#3E81A7']} 
            style={styles.container} 
            animation={animation} 
            duration={1500} 
            easing='ease-out-expo' 
            onAnimationEnd={endState => onFinishAnimation(endState)}
        >
            <ImageBackground source={require('../../assets/quizBox.png')} style={styles.imgBackground} resizeMode="stretch" />
        
            <View style={styles.quizBoxContainer}>
                <View style={styles.headerContainer} >
                    <Text style={styles.quizTitle}>{quiz.quizTitle}</Text>
                </View>

                <QuestionsList scrollRef={scroll} />

                <ProgressBar 
                    progress={progress} 
                    width={screenWidth-80} 
                    height={10} 
                    color="#0078F4"
                    borderWidth={StyleSheet.hairlineWidth}
                    borderColor="white"
                    borderRadius={2}
                    style={styles.progressBar} 
                />

                <Text style={[styles.questionTitle, { fontSize: questionFontSize }]}>{questionTitle}</Text>
            </View>

            <View style={styles.optionsContainer}>
                {
                    options.map((option, index) => ( 
                        <Option 
                            index={index} 
                            isTheCorrectAnswer={quiz.questions[questionIndex].correctOptionIndex===index} 
                            key={index} 
                        /> 
                    ))
                }
            </View>

            <View style={styles.rankingContainer}>
                <Text>Ranking 🏆</Text>
            </View>
        </AnimatableLinear>
        </PlayQuizContext.Provider >
    );
}

