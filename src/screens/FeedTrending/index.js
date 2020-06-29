import React, { useState, useRef, } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl, } from 'react-native';
import QuizList from '../../components/QuizList';
import { useScrollToTop } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import categoriesString from '../../utils/categories';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';
import { systemWeights } from 'react-native-typography';


export default function FeedTrending() {
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [refreshing, setRefreshing] = useState(false);

    function refreshHandler() {
        setRefreshing(true);
        
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }


    return(
        <ScrollView 
            style={{flex: 1, backgroundColor: '#3D6F95'}} 
            ref={scrollRef}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />}
        >
            <View style={styles.container}>
                {/* <LottieView style={{height: 200, width: '100%'}}  resizeMode="contain" source={require('../../assets/explosion.json')} autoPlay loop /> */}
                
                <View style={styles.categoryContainer}>
                    <Icon name="book-open-page-variant" color="white" size={20}/>
                    <Text style={styles.categoryText}>{categoriesString[0].charAt(0).toUpperCase() + categoriesString[0].slice(1)}</Text>
                </View>
                <QuizList scrollRef={scrollRef} request={`/quiz/list?category=${categoriesString[0]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="react" color="white" size={25}/>
                    <Text style={styles.categoryText}>{categoriesString[1].charAt(0).toUpperCase() + categoriesString[1].slice(1)}</Text>
                </View>                
                <QuizList request={`/quiz/list?category=${categoriesString[1]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="infinity" color="white" size={20}/>
                    <Text style={styles.categoryText}>{categoriesString[2].charAt(0).toUpperCase() + categoriesString[2].slice(1)}</Text>
                </View>    
                <QuizList request={`/quiz/list?category=${categoriesString[2]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="video-vintage" color="white" size={20}/>
                    <Text style={styles.categoryText}>{categoriesString[3].charAt(0).toUpperCase() + categoriesString[3].slice(1)}</Text>
                </View>                
                <QuizList request={`/quiz/list?category=${categoriesString[3]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="basketball" color="white" size={22}/>
                    <Text style={styles.categoryText}>{categoriesString[4].charAt(0).toUpperCase() + categoriesString[4].slice(1)}</Text>
                </View>                
                <QuizList request={`/quiz/list?category=${categoriesString[4]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="script-text" color="white" size={20}/>
                    <Text style={styles.categoryText}>{categoriesString[5].charAt(0).toUpperCase() + categoriesString[5].slice(1)}</Text>
                </View>                
                <QuizList request={`/quiz/list?category=${categoriesString[5]}`} refreshControl={refreshing}/>

                <View style={styles.categoryContainer}>
                    <Icon name="earth" color="white" size={24}/>
                    <Text style={styles.categoryText}>{categoriesString[6].charAt(0).toUpperCase() + categoriesString[6].slice(1)}</Text>
                </View>                
                <QuizList request={`/quiz/list?category=${categoriesString[6]}`} refreshControl={refreshing}/>
                
                {/* <Text style={styles.categoryText}>{categoriesString[7].charAt(0).toUpperCase() + categoriesString[7].slice(1)}</Text>
                <QuizList request={`/quiz/list?category=${categoriesString[7]}`} refreshControl={refreshing}/> */}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#3D6F95', 
    },
    categoryContainer: {
        
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    categoryText: {
        fontSize: 22, 
        color: '#fff',
        paddingLeft: 12,
        // borderTopWidth: StyleSheet.hairlineWidth,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#4E4E4E',
        marginVertical: 5,
    }
});