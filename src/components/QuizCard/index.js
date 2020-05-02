import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';


export default function QuizCard({ data }) {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{data.quizTitle}</Text>
            <View style={styles.separator}/>
            <Text style={styles.questions}>{data.questionsLength} questões</Text>
            <Text style={styles.author}>por {data.author.name}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: 250,
        backgroundColor: '#3A6584',
        marginRight: 8,
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