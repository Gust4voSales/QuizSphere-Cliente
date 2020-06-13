import React, { useState, useEffect, useRef, useReducer } from 'react';
import { FlatList, View, ActivityIndicator, Text, StyleSheet, TouchableOpacity, } from 'react-native';
import QuizCard from './QuizCard';
import api from '../services/api';
import { useScrollToTop } from '@react-navigation/native';


export default function QuizList({ request, refreshControl, horizontal=true }) {
    const isMounted = useRef();    
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [showError, setShowError] = useState(false);
    
    // This vertical refresh is used at the instances of this component from the FeedLibrary screen where this component is rendered vertically
    // which means that unlike the FeedTrending page, the refresh action should be handled by this component itself
    const [verticalRefresh, setVerticalRefresh] = useState(false);


    useEffect(() => {
        isMounted.current = true;
        loadQuizzes();

        return () => { isMounted.current = false }
    }, [request]);

    // This useEffect runs when the user is trying to refresh the page, so when that happens we call loadQuizzes again.
    // This happens at the FeedTrending screen page where the QuizLists are horizontal, so the refresh action is fired by the ScrollView
    // in FeedTrending screen, which passes this action to this lit via refreshControll
    useEffect(() => {
        if (refreshControl) loadQuizzes();
    }, [refreshControl]);

    async function loadQuizzes(page=1) {
        try {
            setShowError(false);

            if (page===1) {  // Initial loading indicator
                setLoading(true);
                setVerticalRefresh(true);
            }
            else  // Loading next page
                setLoadingMore(true);  

            const { data } = await api.get(request+`&page=${page}`);
    
            if (isMounted.current) {
                if (page===1) // refreshing
                    setQuizzes(data.quizzes.docs);
                else // Loading more friends, so just add to the arrray
                    setQuizzes([...quizzes, ...data.quizzes.docs,]);

                setTotalPages(data.quizzes.totalPages);
                setPage(page);
                setLoading(false);
                setVerticalRefresh(false);
                setLoadingMore(false);  
            }
        } catch (err) {
            console.log(err);
            if (isMounted.current) {
                setLoading(false);
                setVerticalRefresh(false); 
                setLoadingMore(false);  
                setShowError(true);
            }
        }
    }

    function loadMore() {
        if (page===totalPages) return;
        
        loadQuizzes(page+1);
    }

    function renderFooter() {
        if (loadingMore) {
            return(
                <View style={{width : 100, height: 100, alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator color="white" size="large"/>
                </View>
            )
        } 
        return null;
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
                <TouchableOpacity onPress={() => loadQuizzes()}>
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
                style={horizontal ? { paddingLeft: 10 } : { paddingTop: 10, }}
                horizontal={horizontal}
                showsHorizontalScrollIndicator={false}
                data={quizzes}
                contentContainerStyle={{ alignItems: 'center' }}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <QuizCard data={item} />
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                ListFooterComponentStyle={{marginBottom: 10, marginRight: 10}}
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

