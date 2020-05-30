import React, { useState, useEffect, useRef } from 'react';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import QuizCard from './QuizCard';
import api from '../services/api';
import { useScrollToTop } from '@react-navigation/native';


export default function QuizList({ request, refreshControl, }) {
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        loadQuizzes();
    }, []);

    // This useEffect runs when the user is trying to refresh the page, so when that happens we call loadQuizzes again.
    useEffect(() => {
        if (refreshControl) loadQuizzes();
    }, [refreshControl]);

    async function loadQuizzes() {
        try {
            setShowError(false);
            setLoading(true);

            const { data } = await api.get(request);
            setQuizzes(data.quizzes.docs);
            setLoading(false);
        } catch (err) {
            // console.log(err);
            setShowError(true);
            setLoading(false);
        }
    }


    if (loading) {
        return(
            <View style={{height: 315}}> 
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    if (showError) {
        return(
            <View style={{height: 315, alignItems: 'center',}}>
                <Text style={{ color: 'black',}}>Não foi possível buscar os quizzes</Text>
            </View>
        );
    }

    return(
        <FlatList 
            ref={scrollRef}
            style={{paddingLeft: 10,}}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={quizzes}
            keyExtractor={item => item._id}
            renderItem={({item, index, separator}) => (
                <QuizCard data={item}/>
            )}
        />
    );
}


