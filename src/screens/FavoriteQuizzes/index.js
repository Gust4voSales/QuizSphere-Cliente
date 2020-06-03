import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Text, RefreshControl, ActivityIndicator, } from 'react-native';
import Header from '../../components/Header';
import QuizCard from '../../components/QuizCard';
import { useFocusEffect, useIsFocused, useScrollToTop } from '@react-navigation/native';
import api from '../../services/api';


export default function FavoriteQuizzes() {
    const isMounted = useRef();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showError, setShowError] = useState(false);

    // Change to useEffect?
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
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, height: 170 }}>Não há nada aqui 😅</Text>
            }      
            <FlatList 
                data={quizzes}
                onRefresh={loadQuizzes}
                refreshing={loading}
                style={{flex: 1, paddingTop: 5}}
                keyExtractor={item => item._id}
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
        backgroundColor: '#3D6F95',
        alignItems: 'center',
    }
});