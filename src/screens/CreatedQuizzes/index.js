import React from 'react';
import { View, StyleSheet, } from 'react-native';
import Header from '../../components/Header';
import QuizList from '../../components/QuizList';


export default function CreatedQuizzes() {
    return(
        <View style={styles.container}>
        <Header screenTitle="Criados"/>
            <QuizList request="/quiz?author=true" horizontal={false}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
        alignItems: 'center',
    }
});