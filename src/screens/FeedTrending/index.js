import React, { useState, useRef, } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl, } from 'react-native';
import QuizList from '../../components/QuizList';
import { useScrollToTop } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import LottieView from 'lottie-react-native';

export default function FeedTrending() {
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [refreshing, setRefreshing] = useState(false);
    const categoriesString = ['entretenimento', 'educacionais', 'outros'];


    function refreshHandler() {
        setRefreshing(true);
        
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }


    return(
        <ScrollView 
            style={{flex: 1}} 
            ref={scrollRef}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />}
        >
            <View style={styles.container}>
                {/* <LottieView style={{height: 200, width: '100%'}}  resizeMode="contain" source={require('../../assets/explosion.json')} autoPlay loop /> */}
                
                <Text style={styles.categoryText}>{categoriesString[0].charAt(0).toUpperCase() + categoriesString[0].slice(1)}</Text>
                <QuizList scrollRef={scrollRef} request={`/quiz?category=${categoriesString[0]}`} refreshControl={refreshing}/>

                <Text style={styles.categoryText}>{categoriesString[1].charAt(0).toUpperCase() + categoriesString[1].slice(1)}</Text>
                <QuizList request={`/quiz?category=${categoriesString[1]}`} refreshControl={refreshing}/>

                <Text style={styles.categoryText}>{categoriesString[2].charAt(0).toUpperCase() + categoriesString[2].slice(1)}</Text>
                <QuizList request={`/quiz?category=${categoriesString[2]}`} refreshControl={refreshing}/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#3D6F95', 
    },
    categoryText: {
        fontSize: 22, 
        color: '#eeee',
        paddingLeft: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#4E4E4E',
        marginVertical: 5,
        // ...systemWeights.bold,

    }
});