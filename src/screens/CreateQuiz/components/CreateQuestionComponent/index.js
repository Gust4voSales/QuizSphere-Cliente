import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Touchable  from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import Option from './components/QuestionOption';
import styles from './styles';



export default function CreateQuestionComponent(props) {
    const scroll = useRef(null);
    const [questionModalVisible, setModalVisible] = useState(false);  
    const [isNewQuestion, setIsNewQuestion] = useState(true);  

    const [keyCounter, setKeyCounter] = useState(0)
    const [actualQuestionIndex, setActualQuestionIndex] = useState(0);
    const [actualTitle, setActualTitle] = useState('');
    const [actualOp1, setActualOp1] = useState('');
    const [actualOp2, setActualOp2] = useState('');
    const [actualOp3, setActualOp3] = useState('');
    const [actualOp4, setActualOp4] = useState('');
    const [actualCorrectOp, setActualCorrectOp] = useState(1);

    const [questions, setQuestions] = useState([]);
    // Max number of questions is 25, check line 238

    useEffect(() => {
        props.questionsHandler(questions);
    }, [questions]);

    useEffect(() => {
        let timer = null;

        timer = setTimeout(() => {
            scroll.current.scrollToEnd();
        }, 750);

        return () => clearTimeout(timer);
    }, [questionModalVisible]);

    function clearActualVariables() {
        setActualTitle('');
        setActualOp1('');
        setActualOp2('');
        setActualOp3('');
        setActualOp4('');
        setActualCorrectOp(1);
    }

    function correctOptionHandler(optionIndex) {
        setActualCorrectOp(optionIndex);
    }

    function addQuestion(){
        if (actualTitle.trim().length===0 || actualOp1.trim().length===0 || actualOp2.trim().length===0 || actualOp3.trim().length===0 || actualOp4.trim().length===0 ){
            Alert.alert('', 'Preencha o campo de pergunta e todas as opções');
        } else {
            let question = {
                questionTitle: actualTitle,
                options: [
                    actualOp1,
                    actualOp2,
                    actualOp3,
                    actualOp4,
                ],
                correctOptionIndex: actualCorrectOp-1,
                key: keyCounter.toString(),
            }

            setQuestions([...questions, question]);
            
            clearActualVariables();
            setKeyCounter(keyCounter+1);
            setModalVisible(false);
        }
    }

    function updateQuestion(){
        if (actualTitle.trim().length===0 || actualOp1.trim().length===0 || actualOp2.trim().length===0 || actualOp3.trim().length===0 || actualOp4.trim().length===0 ){
            Alert.alert('', 'Preencha o campo de pergunta e todas as opções');
        } else {
            let questionsTemp = questions;

            let question = {
                questionTitle: actualTitle,
                options: [
                    actualOp1,
                    actualOp2,
                    actualOp3,
                    actualOp4,
                ],
                correctOptionIndex: actualCorrectOp-1,
                key: keyCounter.toString(),
            }

            
            questionsTemp[actualQuestionIndex-1] = question;
            
            setQuestions(questionsTemp);

            clearActualVariables();
            setKeyCounter(keyCounter+1);
            setModalVisible(false);
        }
    }

    function deleteQuestion() {
        Alert.alert(
            '',
            'Tem certeza que deseja deletar a questão?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => null,
                    style: 'cancel',
                },
                {
                    text: 'Sim', 
                    onPress: () => { 
                        // Delete question
                        let questionsTemp = questions;

                        questionsTemp.splice(actualQuestionIndex-1, 1);
                        
                        setQuestions(questionsTemp);

                        clearActualVariables();
                        setModalVisible(false);
                    }
                },
            ],
            {cancelable: false},
        );
            
        
    }

    function closeModalHandler(newQuestion){
        if (newQuestion){
            // Changes have been made
            if (actualTitle.trim().length>0 || actualOp1.trim().length>0 || actualOp2.trim().length>0 || actualOp3.trim().length>0 || actualOp4.trim().length>0 ){                
                Alert.alert(
                    'As alterações não foram salvas',
                    'Fechar mesmo assim?',
                    [
                        {
                        text: 'Cancelar',
                        onPress: () => null,
                        style: 'cancel',
                        },
                        {text: 'Fechar', onPress: () => { 
                            clearActualVariables();
                            setModalVisible(false) 
                        }},
                    ],
                    {cancelable: false},
                );
            } else {
                // No changes have been made
                clearActualVariables();
                setModalVisible(false); 
            }
            return;
        }
        
        // Not a new question has been requested to close
        let unsavedQuestion = {
            questionTitle: actualTitle,
                options: [
                    actualOp1,
                    actualOp2,
                    actualOp3,
                    actualOp4,
                ],
                correctOptionIndex: actualCorrectOp-1,
                key: questions[actualQuestionIndex-1].key
        }

        const tempQuestionString = JSON.stringify(unsavedQuestion);
        const questionString = JSON.stringify(questions[actualQuestionIndex-1]);
        
        //Compare the unsaved actual question object to the actual saved question.
        if (tempQuestionString===questionString){
            // No changes have been made. 
            clearActualVariables();
            setModalVisible(false);
            return;
        } 

        // Changes hava been made.
        Alert.alert(
            'As alterações não foram salvas',
            'Salvar alterações na questão?',
            [
                {
                text: 'Não salvar',
                onPress: () => { setModalVisible(false) },
                style: 'cancel',
                },
                {text: 'OK', onPress: () => updateQuestion()},
            ],
            {cancelable: false},
        );
    }

    return(
        <View style={{ width: '100%' }}>
            <View style={styles.listContainer}>
                <FlatList
                    style={{flexGrow: 0, marginRight: 5}}
                    ref={scroll}
                    horizontal
                    getItemLayout={(data, index) => (
                        {length: 50, offset: 50 * index, index}
                    )}
                    showsHorizontalScrollIndicator={true}
                    data={questions}
                    keyExtractor={item => item.key}
                    renderItem={({item, index, separators}) => 
                        <Touchable style={styles.btn} onPress={() => {
                                setActualQuestionIndex(index+1);    
                                setActualTitle(item.questionTitle);
                                setActualOp1(item.options[0]);
                                setActualOp2(item.options[1]);
                                setActualOp3(item.options[2]);
                                setActualOp4(item.options[3]);  
                                setActualCorrectOp(item.correctOptionIndex+1);      

                                setIsNewQuestion(false);
                                setModalVisible(true);
                            }}
                            
                        >
                            <Text style={{ fontSize: 24, color: 'white' }}>{index+1}</Text>
                        </Touchable>
                    }
                />
                <Touchable
                    style={styles.addBtn} 
                    background ={Touchable.SelectableBackgroundBorderless()}
                    onPress={() => {
                        if (questions.length===25){
                            Alert.alert('', 'Máximo de questões excedido');
                            return;
                        }
                        setActualQuestionIndex(questions.length + 1); 

                        setIsNewQuestion(true);
                        setModalVisible(true);
                    }}
                >
                    <Icon name='add' size={45} color='white'/>
                </Touchable>
            </View>
            <Text style={styles.footerText}>{questions.length>0 && 'Clique para ver a questão'}</Text>
            
            {/* MODAL for the question */}
            <Modal 
                isVisible={questionModalVisible} 
                useNativeDriver
                avoidKeyboard={false}
            >   
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalContainer} >
                    <Touchable 
                        onPress={() => {
                            closeModalHandler(isNewQuestion)
                        }} 
                        style={styles.modalExitBtn} 
                        background={Touchable.SelectableBackgroundBorderless()}
                    >
                        <Icon name='close' size={40} color='#444' />
                    </Touchable>
                    
                    <TextInput 
                        placeholder={'Questão ' + actualQuestionIndex}
                        style={styles.modelQuestionInput}
                        multiline
                        autoCorrect={false}
                        maxLength={160}
                        blurOnSubmit
                        onChangeText={text => {
                            setActualTitle(text);
                        }}
                        underlineColorAndroid='#58AAFF'
                        value={actualTitle}
                    />
                    <Option option='1' setQuestionOption={txt => setActualOp1(txt)} value={actualOp1} correctOption={1===actualCorrectOp} correctOptionHandler={index => correctOptionHandler(index)}/>
                    <Option option='2' setQuestionOption={txt => setActualOp2(txt)} value={actualOp2} correctOption={2===actualCorrectOp} correctOptionHandler={index => correctOptionHandler(index)}/>
                    <Option option='3' setQuestionOption={txt => setActualOp3(txt)} value={actualOp3} correctOption={3===actualCorrectOp} correctOptionHandler={index => correctOptionHandler(index)}/>
                    <Option option='4' setQuestionOption={txt => setActualOp4(txt)} value={actualOp4} correctOption={4===actualCorrectOp} correctOptionHandler={index => correctOptionHandler(index)}/>
                     
                    {/* Button for creating a question */}
                    {isNewQuestion && 
                        <Touchable style={styles.questionBtn} onPress={addQuestion} background={Touchable.SelectableBackgroundBorderless()}>
                            <FIcon name='check' color='white' size={30} />
                        </Touchable>
                    }
                    
                    {/* Buttons for editing a question */}
                    {!isNewQuestion && 
                        <View style={styles.editBtnsContainer}>
                            <Touchable style={[styles.questionBtn, { backgroundColor: '#FF5454' }]} onPress={deleteQuestion} background={Touchable.SelectableBackgroundBorderless()}>
                                <FIcon name='trash' color='white' size={30} />
                            </Touchable>
                            <Touchable style={styles.questionBtn} onPress={updateQuestion} background={Touchable.SelectableBackgroundBorderless()}>
                                <FIcon name='check' color='white' size={30} />
                            </Touchable>
                        </View>    
                    }
                </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

