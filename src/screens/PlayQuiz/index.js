import React, { useEffect, useState, useRef, useCallback, } from 'react';
import { View, Text, ImageBackground, Alert, StatusBar, Dimensions, StyleSheet, BackHandler } from 'react-native';
import PlayQuizContext from '../../contexts/playQuiz';
import ProgressBar from 'react-native-progress/Bar';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import QuestionsList from './components/QuestionsList';
import Option from './components/Option';
import { useFocusEffect, } from '@react-navigation/native';
import { useIsDrawerOpen } from '@react-navigation/drawer';
// import data from './utils/Mock'; // Remove later
import parseQuizTimer from '../../utils/parseQuizTimer';
import moment from 'moment';
import styles from './styles';


const AnimatableLinear = Animatable.createAnimatableComponent(LinearGradient);
const screenWidth = Math.round(Dimensions.get('window').width);
let startGameTimer;
export default function PlayQuiz({ route, navigation, }) {
    const scroll = useRef(null);
    const isDrawerOpen = useIsDrawerOpen();
    const [answeredQuestions, setAnsweredQuestions] = useState([]);

    const [quiz, setQuiz] = useState(route.params.quiz); //Quiz with all the data
    // const [quiz, setQuiz] = useState(data.quiz); // Fake quiz from mock

    const [questionIndex, setQuestionIndex] = useState(0); // The question index from the actual question
    const [questionTitle, setQuestionTitle] = useState(''); // The actual question asked
    const [options, setOptions] = useState([]); // The actual available options
    const [correctAnswers, setCorrectAnswers] = useState(0); // Counter with the correct answers 
    
    const [progress, setProgress] = useState(-1);
    const [animation, setAnimation] = useState(null);
    const [questionFontSize, setFontSize] = useState(22) // Fontsize configs
   
    // Custom BackButton behavior
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Tem certeza que deseja sair?',
                    'Irá perder todo o progresso.',
                    [
                        { text: 'Cancelar', onPress: () => null },
                        { text: 'Tenho certeza', onPress: () => navigation.goBack() },
                    ],
                    { cancelable: true }
                );
                return true;
            };
            
            BackHandler.addEventListener('hardwareBackPress', onBackPress);
            
            return () => { 
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            }
        }, [])
    );

    // Close Drawer when it opens (unfortunately, I'm not being able to disable the drawer from opening since setting gestuneEnabled to false is not working)
    useEffect(() => {
        if (isDrawerOpen)
            navigation.closeDrawer();
    }, [isDrawerOpen]);

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
            '',
            `Você tem ${parseQuizTimer(quiz.time)} minutos para responder ${quiz.questions.length} questões! Preparado? 😛`,
            [{ text: 'INICIAR', onPress: startGame }]    
        );
    }

    function startGame() {
        startGameTimer = moment();
        setProgress(0);
        // console.log('Start Timer: ', startGameTimer.toLocaleString());
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
        navigation.navigate('EndQuizGame', { quiz, timeout, correctAnswers, answeredQuestions })
    }


    return(
        <PlayQuizContext.Provider 
            value={{ quiz, questionIndex, setQuestionIndex, options, answeredQuestions, setAnsweredQuestions, setCorrectAnswers, animation, setAnimation }}
        >
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
        </AnimatableLinear>
        </PlayQuizContext.Provider >
    );
}

