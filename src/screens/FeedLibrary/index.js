import React, { useState, useCallback, useRef, useContext } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl, } from 'react-native';
import QuizList from '../../components/QuizList';
import { useScrollToTop, useFocusEffect, useIsFocused } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';


export default function FeedLibrary() {
    const { user, } = useContext(AuthContext);
    const isTabFocused = useIsFocused();
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // if (!isTabFocused)
                refreshHandler();
        }, [user])
    );

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
            user={user}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />}
        >
            <View style={styles.container}>
                <Text style={styles.categoryText}>Favoritos</Text>
                <QuizList scrollRef={scrollRef} request={'/user/savedQuizzes'} refreshControl={refreshing} />

                <Text style={styles.categoryText}>Compartilhados comigo</Text>
                <QuizList request={`url/test/error`} refreshControl={refreshing}/>

                <Text style={styles.categoryText}>Criados</Text>
                <QuizList request={'/user/quiz'} refreshControl={refreshing}/>
                
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