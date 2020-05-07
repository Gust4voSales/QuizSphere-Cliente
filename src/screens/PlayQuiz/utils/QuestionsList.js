import React, { useContext, } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { systemWeights } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PlayQuizContext from '../../../contexts/playQuiz';


export default function QuestionList(props) {
    const { quiz, answeredQuestions, questionIndex, setQuestionIndex } = useContext(PlayQuizContext);


    function setQuestionAppearence(index) {
        if (index>answeredQuestions.length-1) {
            // Next questions, show the number
            return (
                <Text style={[styles.questionIndex, index===questionIndex && { backgroundColor: '#0E78F4', }]}>
                    {index+1}
                </Text>
            );
        } else if (answeredQuestions[index].userAnswer===answeredQuestions[index].correctAnswer) {
            // Older question and it was answered correctly, show the V 
            return(
                <View style={[styles.questionIndex, index===questionIndex && { backgroundColor: '#0E78F4', }]}> 
                    <Icon name="check" size={26} color="white"/> 
                </View>
            );
        } else {
            // Older question and it was answered uncorrectly, show the X
            return(
                <View style={[styles.questionIndex, index===questionIndex && { backgroundColor: '#0E78F4', }]}> 
                    <Icon name="close" size={26} color="white"/> 
                </View>
            );
        }
    }

    return(
        <FlatList 
            ref={props.scrollRef}
            horizontal
            style={styles.questionList}
            showsHorizontalScrollIndicator={false}
            data={quiz.questions}
            keyExtractor={item => (item._id).toString()}
            renderItem={({item, index, separator}) => {
                return (
                    <TouchableOpacity 
                        onPress={() => setQuestionIndex(index)} 
                        style={{ opacity: index>answeredQuestions.length && 0.4 }} // Next questions have low opacity
                        disabled={index>answeredQuestions.length} // Next questions are disabled
                    > 
                        {setQuestionAppearence(index)}
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    questionList: {
        flexGrow: 0,
        marginTop: 55
    },
    questionIndex: {
        fontSize: 24,
        color: 'white',
        ...systemWeights.light,
        width: 40,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingHorizontal: 5,
        // backgroundColor: 'gray',
        borderColor: '#0E78F4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 5,
        marginHorizontal: 5,
    },
});