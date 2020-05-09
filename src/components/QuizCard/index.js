import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserActionsContext from '../../contexts/userActions';
import QuizOptions from '../QuizOptions';


export default function QuizCard({ data, onPlayQuizHandler, }) {
    const [showOptions, setShowOptions] = useState(false);
    
    function openOptionsHandler() {
        setShowOptions(true);
    }

    function closeOptionsHandler() {
        setShowOptions(false);
    }


    return(
        <TouchableOpacity activeOpacity={0.7} onPress={() => onPlayQuizHandler(data._id)} onLongPress={openOptionsHandler}> 
            <View style={styles.container}>
                <Text style={styles.title}>{data.quizTitle}</Text>
                <Touchable background={Touchable.SelectableBackgroundBorderless()} style={styles.moreIcon} onPress={openOptionsHandler}>
                    <Icon name="more-vert" size={30} color="white" />
                </Touchable>
                <Text style={styles.questions}>{data.questionsLength} questões</Text>
                <Text style={styles.author}>por {data.author.userName}</Text>
            </View>

            <QuizOptions show={showOptions} closeOptions={closeOptionsHandler} quizId={data._id}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        width: 250,
        backgroundColor: '#3A6584',
        marginLeft: 5,
    },
 
    title: {
        position: 'absolute',
        top: 10,
        width: '85%',
        fontSize: 24,
        textAlign: 'center',
        color: 'white',
        paddingBottom: 5,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderColor: 'white',
    },
    moreIcon: {
        position: 'absolute',
        top: 14,
        right: 10,
    },
    questions: {
        color: 'white',
        fontSize: 18,
    },
    author: {
        color: 'white',
        fontSize: 18,
    }
});