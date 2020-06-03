import React, { useState, useEffect, useRef, useReducer } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import QuizCard from './QuizCard';
import api from '../services/api';
import { useScrollToTop } from '@react-navigation/native';


export default function QuizList({ request=false, refreshControl, quizList, horizontal=true }) {
    const isMounted = useRef();    
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    
    // This vertical refresh is used at the instances of this component from the FeedLibrary screen where this component is rendered vertically
    // which means that unlike the FeedTrending page, the refresh action should be handled by this component itself
    const [verticalRefresh, setVerticalRefresh] = useState(false);


    useEffect(() => {
        isMounted.current = true;
        if (request) {
            loadQuizzes();
        } else {
            setQuizzes(quizList);
        }

        return () => { isMounted.current = false }
    }, [quizList]);

    // This useEffect runs when the user is trying to refresh the page, so when that happens we call loadQuizzes again.
    // This happens at the FeedTrending screen page where the QuizLists are horizontal, so the refresh action is fired by the ScrollView
    // in Trending, which passes this action to this lits via refreshControll
    useEffect(() => {
        if (refreshControl) loadQuizzes();
    }, [refreshControl]);

    async function loadQuizzes() {
        try {
            setShowError(false);
            setLoading(true);
            setVerticalRefresh(true);

            const { data } = await api.get(request);
    
            if (isMounted.current) {
                setQuizzes(data.quizzes.docs);
                setLoading(false);
                setVerticalRefresh(false);
            }
        } catch (err) {
            console.log(err);
            if (isMounted.current) {
                setShowError(true);
                setLoading(false);
                setVerticalRefresh(false); 
            }
            
        }
    }


    if (loading) {
        return(
            <View style={{height: 170}}> 
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    if (showError) {
        // onClick should refresh
        return(
            <View style={{height: 170, alignItems: 'center',}}>
                <TouchableOpacity onPress={loadQuizzes}>
                    <Text style={{ color: 'black' }}>Não foi possível buscar os quizzes. Tente novamente.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={ horizontal ? { flex: 1 } : { flex: 1, width: '100%' }}>
            { 
            quizzes.length===0 &&
            <Text style={[{ color: 'white', textAlign: 'center', fontSize: 18 }, horizontal && { height: 170 }]}>Não há nada aqui 😅</Text>
            }
            <FlatList 
                ref={scrollRef}
                onRefresh={loadQuizzes}
                refreshing={verticalRefresh}
                style={horizontal ? { paddingLeft: 10 } : { paddingTop: 10 }}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                // showsVerticalScrollIndicator={false}
                data={quizzes}
                contentContainerStyle={{ alignItems: 'center' }}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <QuizCard data={item} />
                )}
            />
            
        </View>

    );
}


const styles = StyleSheet.create({
    horizontalList: {
        paddingLeft: 10,
    },

    verticalList: {
        width: '100%',
    }
})

