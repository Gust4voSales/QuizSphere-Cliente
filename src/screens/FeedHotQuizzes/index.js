import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import QuizListByCategory from '../../components/QuizListByCategory';

import api from '../../services/api';

export default function FeedHotQuizzes({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState({
        quizzes: []
    });
    const categoriesString = ['entretenimento', 'educacionais'];

    useEffect(() => {
        for (let category of categoriesString) {
            loadAndSetQuizzesByCategory(category);
        }
    }, []);

    useEffect(() => {        
        if (categories.quizzes.length === categoriesString.length) {
            setLoading(false);
        }
    }, [categories]);
    
    async function loadAndSetQuizzesByCategory(category) {
        const { data } = await api.get(`/quiz/?category=${category}`);
        const quizzesByCategory = data.quizzes.docs;
        
        let quizzes = categories.quizzes;
        quizzes.push(quizzesByCategory);
        
        setCategories({ quizzes });
    }

    function createQuizHandler(){
        navigation.navigate('CreateQuiz');
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
                        <QuizListByCategory category={item} quizzes={getQuizzesByCategory(item)} />
                    </View> 
                )}
            />
            <View style={styles.btnContainer}>
                <Touchable onPress={createQuizHandler} style={styles.createQuizBtn} background={Touchable.SelectableBackgroundBorderless()}>
                    <Icon name="add" size={40} color="#06A3FF"/>
                </Touchable>
            </View>
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
    btnContainer: {
        borderRadius: 30, 
        position: 'absolute',
        bottom: 30, 
        right: 20, 
        elevation: 5,
    },
    createQuizBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F9F9F9',
        // backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        // elevation: 5,
    }
});