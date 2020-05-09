import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Modal from 'react-native-modal';

import AuthContext from '../../contexts/auth';
import UserActionsContext from '../../contexts/userActions';


export default function QuizOptions(props) {
    const { user, } = useContext(AuthContext);
    const { saveQuiz, removeQuizFromSavedQuizzes } = useContext(UserActionsContext);

    function checkRankingHandler() {
        console.log('Ver ranking');
        props.closeOptions();
    }

    function saveQuizHandler() {
        saveQuiz(props.quizId);
        props.closeOptions();
    }

    function removeQuizFromSavedQuizzesHandler() {
        removeQuizFromSavedQuizzes(props.quizId);
        props.closeOptions();
    }

    function shareWithFriendHandler() {
        console.log('Share with a friend');
        props.closeOptions();
    }

    function isQuizSavedOnSavedQuizzes() {
        const savedQuizzes = user.savedQuizzes;
        if (savedQuizzes.includes(props.quizId)) 
            return true;

        return false;
    }

    return(
        <Modal
            isVisible={props.show} 
            onBackdropPress={props.closeOptions}
            onBackButtonPress={props.closeOptions}
            useNativeDriver
        >
            <View style={styles.container}>
                {/* Check quiz ranking */}
                <Touchable style={styles.optionBtn} background={Touchable.SelectableBackground()} onPress={checkRankingHandler}>
                    <Text style={styles.optionText}>Ver ranking completo</Text>
                </Touchable>


                {/* Save/Delete quiz from Saved Quizzes */}
                <Touchable 
                    style={styles.optionBtn} 
                    background={Touchable.SelectableBackground()}
                    onPress={
                        isQuizSavedOnSavedQuizzes() ? removeQuizFromSavedQuizzesHandler : saveQuizHandler
                    } 
                >
                    <Text style={styles.optionText}>{isQuizSavedOnSavedQuizzes() ? 'Remover dos salvos' : 'Salvar Quiz' }</Text>
                </Touchable>

                {/* Share with a Friend */}
                <Touchable style={styles.optionBtn} background={Touchable.SelectableBackground()} onPress={shareWithFriendHandler}>
                    <Text style={styles.optionText}>Compartilhar com amigo</Text>
                </Touchable>

            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        // height: 200, // remove
        width: 250,
        backgroundColor: '#4d4c4b',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf:'center',
        borderRadius: 5,
    },
    optionBtn: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    optionText: {
        textAlign: 'left',
        textAlignVertical: 'center',
        color: 'white',
        fontSize: 16,
        paddingHorizontal: 16,
        paddingVertical: 20,
    },
});