import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ImageBackground, Alert, ActivityIndicator } from 'react-native';
import PlayQuizContext from '../../contexts/playQuiz';
import * as Animatable from 'react-native-animatable';
import { systemWeights } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient';
import QuestionsList from './utils/QuestionsList';
import Option from './utils/Option';

// import data from './utils/Mock';
import api from '../../services/api';


AnimatableLinear = Animatable.createAnimatableComponent(LinearGradient);

export default function PlayQuiz({ route, navigation }) {
    const scroll = useRef(null);
    const { quizId } = route.params;
    const [answeredQuestions, setAnsweredQuestions] = useState([]);
    const [quiz, setQuiz] = useState({}); //Quiz with all the data
    const [questionIndex, setQuestionIndex] = useState(0); // The question index from the actual question
    const [questionTitle, setQuestionTitle] = useState(''); // The actual question asked
    const [options, setOptions] = useState([]); // The actual available options
    const [correctAnswers, setCorrectAnswers] = useState(0); // Array with the correct answers only
    
    const [loading, setLoading] = useState(true);
    const [animation, setAnimation] = useState(null);
    const [questionFontSize, setFontSize] = useState(22) // Fontsize configs

    useEffect(() => {
        async function loadQuizData() {
            const { data } = await api.get(`/quiz/${quizId}`); // Should load the data before entering into this screen
            
            setQuiz(data.quiz);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            
            // console.log(data.quiz);
        }

        loadQuizData();

        // setTimeout(() => {
             // let string = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient."
             // setQuestionTitle(string);
        // }, 2000);
    }, []);

    useEffect(() => {
        if (quiz.questions===undefined) return;  // Verification necessary for the beginning when the data has not been fetched  

        const actualQuestion = quiz.questions[questionIndex];
        
        setQuestionTitle(actualQuestion.questionTitle);
        setOptions(actualQuestion.options);
    }, [quiz, questionIndex]);

    useEffect(() => {        
        if(questionTitle.length > 100) setFontSize(16);
        else if(questionTitle.length > 60) setFontSize(18);
        else setFontSize(24);
    }, [questionTitle]);

  
    // useEffect(() => {}, []);

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

    function finishQuiz() {
        console.log('acabou');
        Alert.alert(
            '',
            `PONTUAÇÂO: ${correctAnswers}/${quiz.questionsLength}`,
            [
                { text: 'Retornar', onPress: () => navigation.goBack() },
            ]
        );
    }

    if (loading) {
        return(
            <View style={{ flex: 1, justifyContent: 'center', alignItem: 'center' }}>
                <ActivityIndicator size='large' />
            </View>
        );
    }

    return(
        <PlayQuizContext.Provider value={{ quiz, questionIndex, setQuestionIndex, options, answeredQuestions, setAnsweredQuestions, setCorrectAnswers, setAnimation }}>
        <AnimatableLinear 
            colors={['#364F6B', '#3E81A7']} 
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    imgBackground: {
        position: 'absolute',
        top: '-15%',
        left: '-5.3%',
        width: '106%',
        height: '80%',
    },
    quizBoxContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '35%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        
        // backgroundColor: 'gray'
    },
    headerContainer: {
        position: 'absolute',
        top: 10,
        // backgroundColor: 'pink',
        paddingBottom: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
        width: '80%',
    },
    quizTitle: {
        fontSize: 26,
        color: 'white',
        ...systemWeights.semibold,
        textAlign: 'center',
    },
    

    questionTitle: {
        color: 'white',
        fontSize: 22,
        width: '60%',
        // backgroundColor: 'pink',
        textAlign: 'center',
        alignSelf: 'center',
    },

    optionsContainer: {
        paddingBottom: '30%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },



    rankingContainer: {
        // backgroundColor: 'red'
    },
});