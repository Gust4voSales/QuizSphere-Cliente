import React, { useContext, useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import QuizCard from '../../components/QuizCard';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

// REMEMBER: Change FeedHotQuizzes to FeedTrending
export default function FeedSavedQuizzes({ navigation }) {
    const { user, } = useContext(AuthContext);

    const [quizzes, setQuizzes] = useState([]);

    useEffect(() => {
        // Tratar erro
        async function loadQuizzes() {
            const { data } = await api.get('/user/savedQuizzes');
            
            setQuizzes(data.quizzes.savedQuizzes);
        }

        loadQuizzes();
    }, [user]);
    
    function onPlayQuizHandler(quizId) {
        navigation.navigate('PlayQuiz', { quizId });
    }

    return(
        <View style={{flex: 1}}>
            <Text>Salvos de {user.userName}</Text>
            <FlatList 
                style={{flex: 1}}
                horizontal
                data={quizzes}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <QuizCard data={item} onPlayQuizHandler={onPlayQuizHandler}/>
                )}
            />
        </View>
    );
}


const styles = StyleSheet.create({

});