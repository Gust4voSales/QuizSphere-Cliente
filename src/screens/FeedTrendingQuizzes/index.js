import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import QuizListByCategory from '../../components/QuizListByCategory';

import AuthContext from '../../contexts/auth';
import api from '../../services/api';


export default function FeedTrendingQuizzes({ navigation, route }) {
    const { user } = useContext(AuthContext);
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
    }, [user]);

    useEffect(() => {        
        let isSubscribed = true
        // data fetching has been completed
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

    function getQuizzesByCategory(category, index) {
        let categoryIndex;
        for (let quizzesByCategory of categories.quizzes) {
            if (quizzesByCategory[index].category===category) {
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
                        <QuizListByCategory 
                            category={item} 
                            quizzes={getQuizzesByCategory(item, index)} 
                            onPlayQuizHandler={onPlayQuizHandler} 
                            
                        />
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