import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';


export default function QuizCard({ data, onPlayQuizHandler }) {
    // On long press the card, show the options

    return(
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPlayQuizHandler(data._id)}> 
            <View style={styles.container}>
                <Text style={styles.title}>{data.quizTitle}</Text>
                <View style={styles.separator}/>
                <Text style={styles.questions}>{data.questionsLength} questões</Text>
                <Text style={styles.author}>por {data.author.name}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: 250,
        backgroundColor: '#3A6584',
        marginLeft: 5,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
    },
    separator: {
        width: '90%',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
    },
    questions: {
        color: 'white',
        fontSize: 18,
    },
    author: {
        color: 'white',
        fontSize: 18,
    }
});