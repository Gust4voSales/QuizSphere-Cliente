import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableWithoutFeedback, Switch, Alert, Keyboard } from 'react-native';
import AuthContext from '../../contexts/auth';
import Touchable from 'react-native-platform-touchable';
import { systemWeights } from 'react-native-typography'
import { CommonActions } from '@react-navigation/native';
import CreateQuestionComponent from '../../components/CreateQuestionComponent';
import Picker from './utils/StyledPicker';
import TagInput from './utils/TagInput';
import showAlertError from '../../components/AlertError';

import api from '../../services/api';

// Title, category, tags([string]), numQuestions, quentions([question]), private(bool), timer
// question: questionTitle, options[string], correctOptionIndex

export default function CreateQuiz({ navigation }) {
    // const { userId } = useContext(AuthContext);
    const [quizTitle, setQuizTitle] = useState('');
    const [category, setCategory] = useState("educativo");
    const [isPrivate, setIsPrivate] = useState(false);
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([]);

    function toggleSwitch(){
        setIsPrivate(previousState => !previousState);
    }

    function onTagsChange(t){
        let tempTags = [];
        for (let tag of t){
            tempTags.push(tag.name);
        }

        setTags(tempTags);
    }

    function onPickerSelectionHandler(selection) {
        setCategory(selection);
    }

    async function onSubmit(){
        if (quizTitle.trim().length===0){
            showAlertError('Preencha os campos necessários', 'Título do Quiz em branco!')
            return;
        } 
        if (questions.length<3){
            showAlertError('Preencha os campos necessários', 'Crie pelo menos 3 perguntas!')
            return;
        }

        const data = { quizTitle, category, tags, private: isPrivate, questions };

        try {
            const response = await api.post('quiz', data);
            console.log(response.data);

            const quizData = response.data.quiz;
            Alert.alert(
                '',
                `Quiz "${quizData.quizTitle}" criado com sucesso!`,
                [
                    { text: 'OK', onPress: () => goBack() },
                    // { text: 'OK', onPress: () => null },
                ],    
            );
            
        } catch (err) {
            showAlertError('', err.response === undefined 
                ? 'Erro ao tentar conectar com o servidor. Tente novamente'
                : err.response.data.error
            );
        }
    }

    function goBack() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomePage' }
                ],
            })
        );
    }

    return(
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.container}>
            <View style={styles.informations}>
                <Text style={styles.containerTitle}>Informações</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Título do quiz"
                    onChangeText={text => {
                        setQuizTitle(text)
                    }}
                    maxLength={40}
                    placeholderTextColor='#bbb'
                    underlineColorAndroid='#58AAFF'
                />
                <TagInput onTagsChange={tags => onTagsChange(tags)}/>

                <View style={styles.horizontalInfoContainer}>
                    <Picker handler={onPickerSelectionHandler} selection={category}/>

                    <View style={{ width: '32%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}> 
                        <Text style={{ fontSize: 16, color: 'white' }}>Privado</Text>
                        <Switch
                            trackColor={{ false: "#ddd", true: "#58AAFF" }}
                            thumbColor={isPrivate ? "#fff" : "#eee"}
                            onValueChange={toggleSwitch}
                            value={isPrivate}
                            disabled //remove later
                        />
                    </View>
                </View>
            </View>
            {/* Separator */}
            <View style={{width: '90%', borderWidth: StyleSheet.hairlineWidth, borderColor: '#F8F8F8'}} /> 
            {/* Separator */}
            <View style={styles.questions}>
                <Text style={styles.containerTitle}>Questões</Text>
                
                <CreateQuestionComponent questionsHandler={questions => setQuestions(questions)}/>
                
                <Text style={{ fontSize: 16, ...systemWeights.semibold, color: 'white', }}>OBS:</Text>
                <Text style={styles.textObs}>1. Cria suas questões com apenas uma resposta correta</Text>
                <Text style={styles.textObs}>2. Verifique todas as perguntas antes de criar o quiz</Text>

            </View>

            <Touchable onPress={onSubmit} style={styles.createBtn} background={Touchable.SelectableBackground()}>
                <Text style={{fontSize: 22, color: 'white',}}>CRIAR</Text>
            </Touchable>

        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#4F7795',
    },
    informations: {
        width: '80%',
        height: '45%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    containerTitle: {
        alignSelf: 'flex-start',
        color: 'white',
        fontSize: 24,
    },
    
    horizontalInfoContainer: { 
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
    },
    input: {
        width: '100%',
        color: 'white',
        paddingBottom: 8,
        fontSize: 16,
    },
    
    questions: {
        width: '80%',
        height: '45%',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
        // backgroundColor: '#ddd',
    },
    textObs: {
        fontSize: 14,
        color: 'white',
        marginLeft: 20,
    },
    createBtn: {
        // paddingHorizontal: 12,
        paddingHorizontal: '10%',
        // paddingVertical: 8,
        paddingVertical: 10,
        backgroundColor: '#37506D',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
});