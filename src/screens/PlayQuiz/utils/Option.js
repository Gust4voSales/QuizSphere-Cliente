import React, { useContext, useState, useEffect } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import PlayQuizContext from '../../../contexts/playQuiz';


export default function Option(props) {
    const { quiz, questionIndex, options, onSelectionHandler, showCorrectAnswer }= useContext(PlayQuizContext)
    const [backgroundColor, setBackgroundColor] = useState('#DFF2FF');
    // const [showCorrectAnswer, setShowCorrectAnswer] = useState(props.showCorrectAnswer);


    useEffect(() => {
        // It's time to show the correct answer and this is the one
        if (!showCorrectAnswer) {
            setBackgroundColor('#DFF2FF');
        } else if (showCorrectAnswer && props.isTheCorrectAnswer) {
            setBackgroundColor('#13F4A3');
        } 
    }, [showCorrectAnswer]);


    function onSelectOptionHandler() {
        const question = quiz.questions[questionIndex]

        if (props.isTheCorrectAnswer) {
            console.log('Acertou');
            onSelectionHandler(true);
        } else {
            console.log('Errou');
            setBackgroundColor('#FF5454');
            onSelectionHandler(false);
        }
    }
    
    return(
        <TouchableOpacity 
            style={[styles.container, { backgroundColor }]} 
            onPress={onSelectOptionHandler} 
            activeOpacity={0.8}
            disabled={showCorrectAnswer} // If it's time to show the correct answer the user can't select another option
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