import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import QuizCard from '../QuizCard';
import api from '../../services/api';


export default function QuizListByCategory({ quizzes, }) {
    return(
        <FlatList 
            style={{ flex: 1, }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={quizzes}
            keyExtractor={item => item._id}
            ListHeaderComponent={() => <View style={{ width: 5 }}/>}
            ListFooterComponent={() => <View style={{ width: 10 }}/>} // Add the PLUS button later
            renderItem={({item, index, separator}) => (
                <QuizCard data={item} style={{marginBottom: 10}}/>
            )}
        />
        // <Text>{category}</Text>
    );
}
