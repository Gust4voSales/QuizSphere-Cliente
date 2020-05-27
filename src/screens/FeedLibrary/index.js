import React, { useContext, useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, ToastAndroid } from 'react-native';
import QuizCard from '../../components/QuizCard';
import { useScrollToTop } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';

import api from '../../services/api';

export default function FeedLibary({ navigation }) {
    const { user, setUser } = useContext(AuthContext);
    const scrollRef = useRef(null);
        useScrollToTop(scrollRef);

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadFavoriteQuizzes();
    }, [user]);
    
    async function loadFavoriteQuizzes() {
        try {
            const { data } = await api.get('/user/savedQuizzes');
        
            setQuizzes(data.quizzes.savedQuizzes);
            setLoading(false);
            setRefreshing(false);   
        } catch (err) {
            ToastAndroid.show('Não foi possível buscar os quizzes', ToastAndroid.SHORT);
            setLoading(false);
            setRefreshing(false);
        }
        
    }

    function refreshHandler() {
        setRefreshing(true);

        // Refresh user info as well
        api.get(`/user/${user._id}`)
            .then(({data}) => setUser(data.user)).catch(() => {})

        loadFavoriteQuizzes();
    }

    if (loading) {
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white" />
            </View>
        );
    }

    return(
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshHandler} />}
            ref={scrollRef}
        >
            <View style={styles.container}>
            <Text style={styles.categoryText}>Favoritos</Text>
            <FlatList 
                style={{paddingLeft: 10,}}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={quizzes}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <QuizCard data={item}/>
                )}
            />
            <Text style={styles.categoryText}>Compartilhados comigo</Text>
            <View style={{height: 315}}/> 
            <Text style={styles.categoryText}>Criados</Text>
            <View style={{height: 315}}/>
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