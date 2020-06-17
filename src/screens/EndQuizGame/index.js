import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, BackHandler, } from 'react-native';
import { StackActions, useFocusEffect } from '@react-navigation/native';


export default function EndQuizGame({ route, navigation }) {
    const { quiz, timeout, correctAnswers, answeredQuestions } = route.params;

    console.log('Tempo acabou? ', timeout);
    console.log('Corretas Total: ', correctAnswers);
    console.log('Respondidadas no Total: ', answeredQuestions);
    
    // Custom BackButton behavior
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                const popAction = StackActions.pop(2);

                navigation.dispatch(popAction);
                return true;
            };
    
          BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
          return () =>
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );
    
    // Count correct answers, 
    useEffect(() => {}, [
        
    ]);

    return(
        <View>
            <Text>FIM DE JOGO</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    
});