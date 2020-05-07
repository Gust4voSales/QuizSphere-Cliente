import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Player } from '@react-native-community/audio-toolkit';
import PlayQuizContext from '../../../contexts/playQuiz';

const correctSound = new Player('correct.mp3', { autoDestroy: false });
const wrongSound = new Player('wrong.mp3', { autoDestroy: false });
export default function Option(props) {
    const { quiz, questionIndex, options, answeredQuestions, setAnsweredQuestions, updateQuestion, setAnimation }= useContext(PlayQuizContext)
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
        setAnimation('jello');
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
        height: 50,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 15,
        elevation: 8,
    },
    text: {
        fontSize: 16,
        color: '#162F48',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});