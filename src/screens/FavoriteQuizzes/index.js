import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, ActivityIndicator, } from 'react-native';
import Header from '../../components/Header';
import QuizCard from '../../components/QuizCard';
import api from '../../services/api';

// Unlike SharedQuizzes and CreatedQuizzes, this component needs the quiz list to be in its posession (one of its states) because 
// whenever a quiz is removed from the favorites, this component needs to re-render. If this screen were built as the othe two
// whenever a quiz were removed from favorite it wouldn't be possible to remove it from the list.
export default function FavoriteQuizzes() {
    const isMounted = useRef();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        isMounted.current = true;

        loadQuizzes();
        return () => { isMounted.current = false }
    }, []);


    async function loadQuizzes() {
        try {
            setShowError(false);
            setLoading(true);

            const { data } = await api.get('/user/savedQuizzes');

            if (isMounted.current) {
                setQuizzes(data.quizzes.docs);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            if (isMounted.current) {
                setLoading(false);
                setShowError(true);
            }
        }
        
    }

    function removeFavoriteFromList(quizId) {
        setQuizzes(quizzes.filter(quiz => quiz._id!=quizId));
    }

    if (loading) {
        return(
            <View style={styles.container}>
                <Header screenTitle="Favoritos" />
                <ActivityIndicator size="large" color="white"/>
            </View>
        );
    }

    if (showError) {
        return(
            <View style={styles.container}>
                <Header screenTitle="Favoritos"/>
                <TouchableOpacity onPress={loadQuizzes}>
                    <Text style={{ color: 'black' }}>Não foi possível buscar os quizzes. Tente novamente.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.container}>
        <Header screenTitle="Favoritos"/>
            { 
            quizzes.length===0 &&
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Não há nada aqui 😅</Text>
            }      
            <FlatList 
                data={quizzes}
                onRefresh={loadQuizzes}
                refreshing={loading}
                style={{ width: '100%',paddingTop: 5, }}
                keyExtractor={item => item._id}
                contentContainerStyle={{ alignItems: 'center', }}
                renderItem={({item, index, separator}) => (
                    <QuizCard data={item} removeFromList={id => removeFavoriteFromList(id)} />
                )}
            />
            
        
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#3D6F95',
        alignItems: 'center',
    }
});