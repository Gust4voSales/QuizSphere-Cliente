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
    const { likeQuiz, deslikeQuiz, addFavoriteQuiz, removeFavoriteQuiz } = useContext(UserActionsContext);
    const [liked, setLiked] = useState(data.liked);
    const [likeCounter, setLikeCounter] = useState(data.likeCounter);
    
    
    async function likeQuizHandler() {
        const success = await likeQuiz(data._id);
        if (success) {
            setLiked(true);
            setLikeCounter(likeCounter+1);
        }
    }

    async function deslikeQuizHandler() {
        const success = await deslikeQuiz(data._id);
        if (success) {
            setLiked(false);
            setLikeCounter(likeCounter-1);
        }
    }

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
        
            navigation.navigate('PlayQuiz', { quiz })
        } catch (err) {
            console.log(err);
            ToastAndroid.show('Não foi possível carregar o Quiz', ToastAndroid.SHORT);
        }
    }

    // HELPER FUNCTIONS

    function parseTime(time) {
        let strTime = time.toString();       
        
        if (strTime.includes('.5')) {
            return `${strTime[0]}:30`;
        } else {
            return strTime;
        }
    }

    // I admit that i've basically copy pasted this code from stackoverflow :)
    function parseLikes(likesNumber) {
        let newValue = likesNumber;
        if (likesNumber >= 1000) {
            let suffixes = ["", "k", "m", "b","t"];
            let suffixNum = Math.floor( (""+likesNumber).length/3 );
            let shortValue = '';
            for (let precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum != 0 ? (likesNumber / Math.pow(1000,suffixNum) ) : likesNumber).toPrecision(precision));
                let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }
            if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
        }
        return newValue;
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
                <TouchableOpacity onPress={liked ? deslikeQuizHandler : likeQuizHandler} activeOpacity={.75}> 
                    <View style={{flexDirection: 'row', alignItems: 'flex-end',}}>
                        <Icon name={liked ? "heart" : "heart-outline"} color={liked ? "#00A3FF" : "white"} size={28}/> 
                        <Text style={styles.likeCounter}>{parseLikes(likeCounter)}</Text>
                    </View>
                </TouchableOpacity>

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
        // height: 160,
        height: 260,
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
    likeCounter: {
        color: '#FFFEFE',
        fontSize: 14,
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