import React, { useState, } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Switch, Alert, Keyboard, ToastAndroid, ActivityIndicator } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Header from '../../components/Header';
import { CommonActions } from '@react-navigation/native';
import CreateQuestionComponent from './components/CreateQuestionComponent';
import Picker from './components/StyledPicker';
import TagInput from './components/TagInput';
import showAlertError from '../../components/AlertError';
import api from '../../services/api';

import styles from './styles';


const categories = ['entretenimento', 'educacionais', 'outros'];
const timers = ['1 min', '1:30 min', '2 min', '2:30 min', '5 min', '10 min', '15 min', '30 min',];

export default function CreateQuiz({ navigation }) {
    const [quizTitle, setQuizTitle] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [tags, setTags] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [time, setTime] = useState(timers[0]);

    const [loading, setLoading] = useState(false);

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

    function onCategorySelection(selection) {
        setCategory(selection);
    }

    function onTimeSelection(selection) {
        setTime(selection);
    }

    function checkDataBeforeCreating() {
        if (quizTitle.trim().length<4){
            ToastAndroid.show('Título do Quiz precisa ter pelo menos 4 caracteres.', ToastAndroid.SHORT);
            return true;
        } 
        if (questions.length<3){
            ToastAndroid.show('Crie pelo menos 3 perguntas!', ToastAndroid.SHORT);
            return true;
        }

        if (questions.length>10 && time===timers[0]) {
            ToastAndroid.show(`Tempo de ${time} é muito curto para um quiz de ${questions.length} questões`, ToastAndroid.SHORT);
            return true;
        } else if (questions.length>15 && (time===timers[0] || time===timers[1])) {
            ToastAndroid.show(`Tempo de ${time} é muito curto para um quiz de ${questions.length} questões`, ToastAndroid.SHORT);
            return true;
        } else if (questions.length>20 && (time===timers[0] || time===timers[1] || time===timers[2])) {
            ToastAndroid.show(`Tempo de ${time} é muito curto para um quiz de ${questions.length} questões`, ToastAndroid.SHORT);
            return true;
        }

        return false;
    }

    async function onSubmit(){
        const error = checkDataBeforeCreating();
        if (error) return;

        const data = { quizTitle, category, tags, private: isPrivate, questions, time };
        try {
            setLoading(true);

            await api.post('quiz', data);
            
            Alert.alert(
                '',
                `Quiz "${quizTitle}" criado com sucesso!`,
                [
                    { text: 'OK', onPress: resetAndReturnAfterCreating },
                    // { text: 'deixa', onPress: () => null }, // remove
                ],    
            );
            setLoading(false);
        } catch (err) {
            setLoading(false);
            showAlertError('', err.response === undefined 
                ? 'Erro ao tentar conectar com o servidor. Tente novamente'
                : err.response.data.error
            );
        }
    }

    function resetAndReturnAfterCreating() {
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
        <View style={{flex: 1}}> 
            <Header screenTitle="Criar Quiz" />
            
            <View style={styles.container}>
                <TextInput 
                    style={styles.input} 
                    placeholder="Título do quiz"
                    onChangeText={text => {
                        setQuizTitle(text)
                    }}
                    autoCorrect={false}
                    maxLength={40}
                    placeholderTextColor='#ddd'
                    underlineColorAndroid='#58AAFF'
                />
                
                <Text style={{color: '#ddd', fontSize: 15, alignSelf: 'flex-start', marginLeft: 1,}}>Tags</Text>
                <TagInput onTagsChange={tags => onTagsChange(tags)}/>
                
                <View style={styles.horizontalInfoContainer}>
                    <View style={{flex: 1.5}}>
                        <Text style={{color: '#ddd', marginLeft: 1, fontSize: 15,}}>Tempo do quiz</Text>
                        <Picker handler={onTimeSelection} selection={time} items={timers}/>
                        
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', }}> 
                        <Text style={{fontSize: 15, color: '#ddd', marginTop: 1 }}>Privado</Text>
                        <Switch
                            trackColor={{ false: "#ddd", true: "#58AAFF" }}
                            thumbColor={isPrivate ? "#fff" : "#eee"}
                            onValueChange={toggleSwitch}
                            value={isPrivate}
                            style={{paddingTop: 9,}}
                        />
                    </View>
                </View>
            
                <Text style={{color: '#ddd', fontSize: 15, alignSelf: 'flex-start', marginLeft: 1,}}>Categoria</Text>
                <Picker handler={onCategorySelection} selection={category} items={categories}/>

                <Text style={styles.questionsTitle}>Questões</Text>
                <CreateQuestionComponent questionsHandler={questions => setQuestions(questions)}/>

                <Touchable onPress={onSubmit} style={styles.createBtn} background={Touchable.SelectableBackground()} disabled={loading}>
                    {
                        loading
                        ? <ActivityIndicator size="large" color="white" />
                        : <Text style={styles.createBtnText}>Criar</Text>
                    }
                </Touchable>
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

