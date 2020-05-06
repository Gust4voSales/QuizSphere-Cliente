import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import QuizListByCategory from '../../components/QuizListByCategory';

import api from '../../services/api';


export default function FeedHotQuizzes({ navigation, route }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState({
        quizzes: [],
    });
    const categoriesString = ['entretenimento', 'educacionais'];

    useEffect(() => {
        let fetchData = true;
        for (let category of categoriesString) {
            loadAndSetQuizzesByCategory(category, fetchData);
        }

        return() => fetchData = false;
    }, []);

    useEffect(() => {        
        let isSubscribed = true
        if (categories.quizzes.length === categoriesString.length) {
            if (isSubscribed) setLoading(false);
        }

        return() => isSubscribed = false;
    }, [categories]);
    
    async function loadAndSetQuizzesByCategory(category, fetch) {
        try{
            const { data } = await api.get(`/quiz/?category=${category}`);
            const quizzesByCategory = data.quizzes.docs;
            
            let quizzes = categories.quizzes;
            quizzes.push(quizzesByCategory);
            
            if (fetch) setCategories({ quizzes });
        } catch(err) {
            console.log(err);
            Alert.alert('err');
        }
    }

    function onPlayQuizHandler(quizId) {
        navigation.navigate('PlayQuiz', { quizId });
    }

    function getQuizzesByCategory(category) {
        let categoryIndex;
        for (let quizzesByCategory of categories.quizzes) {
            if (quizzesByCategory[0].category===category) {
                categoryIndex = categories.quizzes.indexOf(quizzesByCategory);
                break;
            }
        }
        
        return categories.quizzes[categoryIndex];
    }

    if (loading) {
        return(
            <ActivityIndicator size='large' />
        );
    }

    return(
        <View style={styles.container}>
            <FlatList 
                data={ categoriesString }
                keyExtractor={item => item}
                renderItem={({item, index, separators}) => (
                    <View>
                        <Text>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                        <QuizListByCategory category={item} quizzes={getQuizzesByCategory(item)} onPlayQuizHandler={onPlayQuizHandler} />
                    </View> 
                )}
            />
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // width: '100%',
        // height: '100%',
        backgroundColor: '#7B99AF',
    },
  
    
});