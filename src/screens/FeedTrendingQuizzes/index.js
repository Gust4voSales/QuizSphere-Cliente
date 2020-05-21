import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import QuizListByCategory from '../../components/QuizListByCategory';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';


export default function FeedTrendingQuizzes({ navigation, route }) {
    const { user, setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [categories, setCategories] = useState({
        quizzes: [],
    });
    const categoriesString = ['entretenimento', 'educacionais'];

    useEffect(() => {
        async function loadCategories() {
            for (let category of categoriesString) {
                await loadAndSetQuizzesByCategory(category);
            }
        }

        loadCategories();
    }, []);

    // Check whether data fetching has been completed or not, if so then set loading to false
    useEffect(() => {        
        if (categories.quizzes.length === categoriesString.length) {
            setLoading(false);
        }
    }, [categories]);
    
    async function refreshHandler() {
        setCategories({ quizzes: [], });
        setRefreshing(true);

        // Refresh user info as well 
        api.get(`/user/${user._id}`)
            .then(({data}) => setUser(data.user)).catch(() => {});

        for (let category of categoriesString) {
            await loadAndSetQuizzesByCategory(category);
        }
        setRefreshing(false);
    }

    async function loadAndSetQuizzesByCategory(category) {
        try{
            const { data } = await api.get(`/quiz/?category=${category}`);
            const quizzesByCategory = data.quizzes.docs;
            
            let quizzes = categories.quizzes;
            quizzes.push(quizzesByCategory);
            
            setCategories({ quizzes });
        } catch(err) {
            console.log(err);
            if (categoriesString[categoriesString.length-1]!==category) return; // This will prevent error messages at each iteration. 
            setCategories({ quizzes: [], });
            setLoading(false);
            ToastAndroid.show('Não foi possível buscar os quizzes', ToastAndroid.SHORT);
        }
    }

    // Get the corresponding array of quizzes from that category
    function getQuizzesByCategory(category, index) {
        let categoryIndex;
        for (let quizzesByCategory of categories.quizzes) {
            if (quizzesByCategory[index].category===category) {
                categoryIndex = categories.quizzes.indexOf(quizzesByCategory);
                break;
            }
        }
        
        return categories.quizzes[categoryIndex];
    }


    if (loading) {
        return(
            <View style={styles.container}>
                <ActivityIndicator size='large' color="white" />
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <FlatList 
                data={ categoriesString }
                refreshing={refreshing}
                onRefresh={refreshHandler}
                keyExtractor={item => item}
                renderItem={({item, index, separators}) => (
                    <View>
                        <Text style={styles.categoryText}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
                        <QuizListByCategory 
                            category={item} 
                            quizzes={getQuizzesByCategory(item, index)}  
                        />
                    </View> 
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // width: '100%',
        // height: '100%',
        backgroundColor: '#3D6F95'
        // backgroundColor: 'white'
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