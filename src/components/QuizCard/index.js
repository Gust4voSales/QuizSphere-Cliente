import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback, Alert, ToastAndroid, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import UserActionsContext from '../../contexts/userActions';
import QuizOptions from '../QuizOptions';
import api from '../../services/api';
import { systemWeights } from 'react-native-typography';


export default function QuizCard({ data, removeFromList=null }) {
    const navigation =  useNavigation();
    const { user } = useContext(AuthContext);
    const { addFavoriteQuiz, removeFavoriteQuiz } = useContext(UserActionsContext);
    const [showOptions, setShowOptions] = useState(false);
    
    function addFavoriteHandler() {
        addFavoriteQuiz(data._id);
    }

    function removeFavoriteHandler() {
        removeFavoriteQuiz(data._id);
        if (removeFromList) removeFromList(data._id);
    }

    function onPlayQuizHandler() {
        Alert.alert(
            '',
            `Jogar "${data.quizTitle}"?`,
            [
                { text: 'Não', onPress: () => null },
                { text: 'Sim', onPress: playQuiz },
            ],   
            { cancelable: true } 
        );
    }

    async function playQuiz() {
        try {
            const response = await api.get(`/quiz/${data._id}`); 
            const quiz = response.data.quiz;
            // quiz.time = 10; // remove later
            
            navigation.navigate('PlayQuiz', { quiz })
        } catch (err) {
            console.log(err);
            ToastAndroid.show('Não foi possível carregar o Quiz', ToastAndroid.SHORT);
        }
    }

    function parseTime(time) {
        let strTime = time.toString();       
        
        if (strTime.includes('.5')) {
            return `${strTime[0]}:30`;
        } else {
            return strTime;
        }
    }

    function isQuizOnFavorites() {
        const savedQuizzes = user.savedQuizzes;
        if (savedQuizzes.includes(data._id)) 
            return true;

        return false;
    }

    return(
        <Touchable
            foreground={TouchableNativeFeedback.Ripple('#3D6F95')}
            onPress={onPlayQuizHandler} 
            // onLongPress={openOptionsHandler}
            style={{borderRadius: 20, marginBottom: 10, marginHorizontal: 5,}}
        > 
        
        <LinearGradient colors={['#364F6B', '#3E7B9D']} style={styles.container}>
            <Text style={styles.author}>{data.author.userName}</Text>
            <Text style={styles.quizTitle}>{data.quizTitle}</Text>
            
            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>{data.questionsLength} questões</Text>
                <Text style={styles.infoText}>{parseTime(data.time)} min</Text>
            </View>

            <View style={styles.actionIcons}>
                <View> 
                    <Icon name="heart-outline" color="white" size={28}/> 
                </View>
                <TouchableOpacity 
                    onPress={
                        isQuizOnFavorites() ? removeFavoriteHandler : addFavoriteHandler
                    }
                    activeOpacity={.75}
                > 
                    <Icon name={isQuizOnFavorites() ? "star" : "star-outline"} color={isQuizOnFavorites() ? "#00A3FF" : "white"} size={28}/>
                </TouchableOpacity>
                <View> 
                    <Icon name="share" color="white" size={28}/>
                </View>
                <View> 
                    <Icon name="tag" color="white" size={28} style={{transform: [{ rotateY: '180deg' }]}}/>
                </View>
            </View>
        </LinearGradient>
        </Touchable>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 160,
        width: 270,
        
        borderRadius: 20,
        elevation: 4,
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between'
    },
    author: {
        color: '#CBCBCB',
        ...systemWeights.bold,
        fontSize: 14,
    },
    quizTitle: {
        color: 'white',
        ...systemWeights.semibold,
        fontSize: 20,
        // backgroundColor: '#ddd'
    },
    infoContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoText: {
        color: 'white',
        fontSize: 15,
    },
    actionIcons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

});

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         height: 315,
//         width: 250,
//         marginHorizontal: 5,
//         marginBottom: 10,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         elevation: 6,
//         // backgroundColor : "#0000" // invisible color
//     },
//     title: {
//         position: 'absolute',
//         top: 10,
//         width: '85%',
//         fontSize: 24,
//         textAlign: 'center',
//         color: 'white',
//         paddingBottom: 5,
//         // borderBottomWidth: StyleSheet.hairlineWidth,
//         // borderColor: 'white',
//     },
//     moreIcon: {
//         position: 'absolute',
//         top: 14,
//         right: 10,
//     },
//     questions: {
//         color: 'white',
//         fontSize: 18,
//     },
//     author: {
//         color: 'white',
//         fontSize: 18,
//     }
// });