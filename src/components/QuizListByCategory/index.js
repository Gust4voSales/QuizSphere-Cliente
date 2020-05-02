import React from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import QuizCard from '../QuizCard';

export default function QuizListByCategory({ category, quizzes }) {
    // console.log(quizzes);
    
    return(
        <FlatList 
            style={{ flex: 1 }}
            horizontal
            data={quizzes}
            keyExtractor={item => item._id}
            renderItem={({item, index, separator}) => <QuizCard data={item}/>}
        />
        // <Text>{category}</Text>
    );
}

const styles = StyleSheet.create({

});