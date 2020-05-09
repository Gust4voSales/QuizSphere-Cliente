import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import QuizCard from '../../components/QuizCard';
import AuthContext from '../../contexts/auth';


export default function FeedSavedQuizzes() {
    const { user, } = useContext(AuthContext);

    const [quizzes, setQuizzes] = useState({});

    useEffect(() => {
        async function loadQuizzes() {
            
        }

        loadQuizzes();
    }, []);
    
    function onPlayQuizHandler(quizId) {
        navigation.navigate('PlayQuiz', { quizId });
    }

    return(
        <FlatList 
            data={user.savedQuizzes}
            keyExtractor={item => item._id}
            renderItem={({item, index, separator}) => (
                <QuizCard data={item} onPlayQuizHandler={onPlayQuizHandler}/>
            )}
        />
    );
}


const styles = StyleSheet.create({

});