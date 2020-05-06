import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, ImageBackground, FlatList, TouchableOpacity } from 'react-native';
import PlayQuizContext from '../../contexts/playQuiz';
import { systemWeights } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient';
import Option from './utils/Option';

// import data from './utils/Mock';
import api from '../../services/api';


export default function PlayQuiz({ route, navigation }) {
    const { quizId } = route.params;
    let answeredQuestions = [];
    const [quiz, setQuiz] = useState({}); //Quiz with all the data
    const [questionIndex, setQuestionIndex] = useState(-1); // The question index from the actual question
    const [questionTitle, setQuestionTitle] = useState(''); // The actual question asked
    const [options, setOptions] = useState([]); // The actual available options
    const [correctAnswers, setCorrectAnswers] = useState([]); // Array with the correct answers only
    
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false) // If true then the user selected an option and we need to show the correct answer
    const [questionFontSize, setFontSize] = useState(22) // Fontsize configs

    useEffect(() => {
        async function loadQuizData() {
            const { data } = await api.get(`/quiz/${quizId}`); // Should load the data before entering into this screen
            
            setQuiz(data.quiz);

            setQuestionIndex(0);

            // console.log(data.quiz);
        }

        loadQuizData();

        // setTimeout(() => {
             // let string = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient."
             // setQuestionTitle(string);
        // }, 2000);
    }, []);

    useEffect(() => {
        if (quiz.questions===undefined || questionIndex===-1) return;  // Verification necessary for the beginning when the data has not been fetched yet 

        const actualQuestion = quiz.questions[questionIndex];
        // console.log(actualQuestion);
        
        setQuestionTitle(actualQuestion.questionTitle);
        setOptions(actualQuestion.options);
        setShowCorrectAnswer(false);
    }, [quiz, questionIndex]);

    useEffect(() => {        
        if(questionTitle.length > 100) setFontSize(16);
        else if(questionTitle.length > 60) setFontSize(18);
        else setFontSize(24);
    }, [questionTitle]);

    // useEffect(() => {}, []);

    function onSelectionHandler(isCorrect) {
        setShowCorrectAnswer(true);

        if (isCorrect) {
            setCorrectAnswers([...correctAnswers, questionIndex]);
        } 
        if (questionIndex+1===quiz.questionsLength) {
            console.log('acabou');
            return;
        }

        setTimeout(() => updateQuestion(), 1000);
    }


    function updateQuestion() {
        console.log('nova questão');

        setQuestionIndex(questionIndex => questionIndex+1);
    }

    return(
        <PlayQuizContext.Provider value={{ quiz, questionIndex, options, correctAnswers, onSelectionHandler, showCorrectAnswer }}>
        <LinearGradient colors={['#364F6B', '#3E81A7']} style={styles.container}>
            <ImageBackground source={require('../../assets/quizBox.png')} style={styles.imgBackground} resizeMode="stretch" />
        
            <View style={styles.quizBoxContainer}>
                <View style={styles.headerContainer} >
                    <Text style={styles.quizTitle}>{quiz.quizTitle}</Text>
                </View>

                <FlatList 
                    horizontal
                    style={styles.questionList}
                    showsHorizontalScrollIndicator={false}
                    data={quiz.questions}
                    keyExtractor={item => (item._id).toString()}
                    renderItem={({item, index, separator}) => {
                        let actualQuestion;
                        if (index===questionIndex) actualQuestion = true;

                        return (
                            <TouchableOpacity onPress={() => setQuestionIndex(index)}>
                                <Text style={[styles.questionIndex, actualQuestion && { backgroundColor: '#0E78F4', }]}>
                                    {index+1}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
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
        </LinearGradient>
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
    questionList: {
        flexGrow: 0,
        marginTop: 55
    },
    questionIndex: {
        fontSize: 24,
        color: 'white',
        ...systemWeights.light,
        width: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingHorizontal: 5,
        // backgroundColor: 'gray',
        borderColor: '#0E78F4',
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 5,
        marginHorizontal: 5,
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