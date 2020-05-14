import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import QuizCard from '../QuizCard';

export default function QuizListByCategory({ category, quizzes, onPlayQuizHandler, }) {
    // console.log(quizzes);
    
    return(
        <FlatList 
            style={{ flex: 1, }}
            horizontal
            data={quizzes}
            keyExtractor={item => item._id}
            ListHeaderComponent={() => <View style={{ width: 5 }}/>}
            ListFooterComponent={() => <View style={{ width: 10 }}/>} // Add the PLUS button later
            renderItem={({item, index, separator}) => (
                <QuizCard data={item} onPlayQuizHandler={onPlayQuizHandler} style={{marginBottom: 10}}/>
            )}
        />
        // <Text>{category}</Text>
    );
}
