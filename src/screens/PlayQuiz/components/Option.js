import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '@react-native-community/audio-toolkit';
import PlayQuizContext from '../../../contexts/playQuiz';

const correctSound = new Player('correct.mp3', { autoDestroy: false });
const wrongSound = new Player('wrong.mp3', { autoDestroy: false });
export default function Option(props) {
    const { quiz, questionIndex, options, answeredQuestions, setAnsweredQuestions, setCorrectAnswers, setAnimation }= useContext(PlayQuizContext)
    const [backgroundColor, setBackgroundColor] = useState('#DFF2FF');


    useEffect(() => {
        if (questionIndex>(answeredQuestions.length-1)) {
            setBackgroundColor('#DFF2FF');
            return ;
        }
        // Question has been answered

        if (props.isTheCorrectAnswer) // Option is the correct answer
            setBackgroundColor('#13F4A3');
        else if (props.index===answeredQuestions[questionIndex].userAnswer) // This option is not the correct answer but it's the user answer
            setBackgroundColor('#FF5454');
        else // Neither the correct answer nor the user choice
            setBackgroundColor('#DFF2FF'); 
    }, [questionIndex, answeredQuestions]);


    function setNewAnswer() {
        // Add the new answered question with the user choice and the correct answer
        const question = quiz.questions[questionIndex]

        const newAnsweredQuestion = { 
            userAnswer: props.index,
            correctAnswer: question.correctOptionIndex,
        };

        setAnsweredQuestions([...answeredQuestions, newAnsweredQuestion]); 
    }

    function onSelectOptionHandler() {
        // Run the proper animation, when the animation is done a function at the parent component will call function that updates the question.
        if (props.isTheCorrectAnswer) {
            setCorrectAnswers(correctAnswers => correctAnswers+1);
            runCorrectSelectionAnimation();
        } else {
            runWrongSelectionAnimation();
        }

        setNewAnswer();
    }
    
    function runCorrectSelectionAnimation() {
        correctSound.play();        
        setAnimation('pulse');
    }
    
    function runWrongSelectionAnimation() {
        wrongSound.play();        
        setAnimation({
            0: {
              scale: 1,
              skewX: '0deg',
              skewY: '0deg',
            },
            0.111: {
              skewX: '0deg',
              skewY: '0deg',
            },
            0.222: {
              scale: 1.2,
              skewX: '-12.5deg',
              skewY: '-12.5deg',
            },
            0.333: {
              skewX: '6.25deg',
              skewY: '6.25deg',
            },
            0.444: {
              skewX: '-3.125deg',
              skewY: '-3.125deg',
            },
            0.555: {
              skewX: '1.5625deg',
              skewY: '1.5625deg',
            },
            0.666: {
              skewX: '-0.78125deg',
              skewY: '-0.78125deg',
            },
            0.777: {
              skewX: '0.390625deg',
              skewY: '0.390625deg',
            },
            0.888: {
              skewX: '-0.1953125deg',
              skewY: '-0.1953125deg',
            },
            1: {
              scale: 1,
              skewX: '0deg',
              skewY: '0deg',
            },
        });
    }


    return(
        <TouchableOpacity 
            style={[styles.container, { backgroundColor }]} 
            onPress={onSelectOptionHandler} 
            activeOpacity={0.8}
            disabled={questionIndex <= (answeredQuestions.length-1 )} // If the user has answered this question already then he can't select another option
        >
            <Text style={styles.text}>{options[props.index]}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 55,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        marginBottom: 15,
        paddingHorizontal: 3,
        elevation: 8,
    },
    text: {
        fontSize: 16,
        color: '#162F48',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});