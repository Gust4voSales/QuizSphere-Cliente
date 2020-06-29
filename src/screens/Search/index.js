import React, { useState, } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuizList from '../../components/QuizList';
import styles from './styles';


export default function Screen({ navigation }) {
    let timerId = 0;
    const [filter, setFilter] = useState('title');
    const [input, setInput] = useState('');
    const [inputFilter, setInputFilter] = useState('');

    function onInputTextChange(text) {
        setInput(text);   
        
        if (timerId)
            clearTimeout(timerId);

        timerId = setTimeout(() => {
            setInputFilter(text.trim());
        }, 1000);
    }

    function onFilterSelection(filter) {
        setFilter(filter);
        setInputFilter('');
    }
        
    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchBar}>
                    <TouchableWithoutFeedback onPress={() => null}>
                        <Icon name="magnify" color="#BBB" size={30} style={{marginLeft: 5}}/>
                    </TouchableWithoutFeedback>
                    <TextInput 
                        style={styles.input}
                        placeholder={`Pesquisar quiz por ${filter==='title' ? 'título' : 'tag'}`}
                        placeholderTextColor="#BBB"
                        // value={input}
                        onChangeText={text => onInputTextChange(text)}
                        autoFocus 
                    />
                </View>
                <TouchableOpacity 
                    onPress={navigation.goBack} 
                    style={{width: '20%',}}
                    hitSlop={{top: 5, bottom: 5, left: 5, right: 5}}
                    activeOpacity={.7}
                >
                    <Text style={styles.closeTxt}>fechar</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.filterChoices}>
                <TouchableOpacity 
                    style={[{ backgroundColor: filter==='title' ? '#06A3FF' : 'transparent' }, styles.btnFilter ]}
                    onPress={() => onFilterSelection('title')}
                    activeOpacity={.7}
                >
                    <Text style={{ color: 'white' }}>título</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[{ backgroundColor: filter==='tag' ? '#06A3FF' : 'transparent' }, styles.btnFilter ]}
                    onPress={() => onFilterSelection('tag')}
                    activeOpacity={.7}                >
                    <Text style={{ color: 'white' }}>tag</Text>
                </TouchableOpacity>
            </View>
            { 
            inputFilter.length>0 &&
            <QuizList request={`/quiz/list?${filter}=${inputFilter}`} horizontal={false}/>
            }
            
        </View>
        </TouchableWithoutFeedback>
    );
}

