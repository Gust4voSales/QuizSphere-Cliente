import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuizList from '../../components/QuizList';


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
                    onPress={() => setFilter('title')}
                    activeOpacity={.7}
                >
                    <Text style={{ color: 'white' }}>título</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[{ backgroundColor: filter==='tag' ? '#06A3FF' : 'transparent' }, styles.btnFilter ]}
                    onPress={() => setFilter('tag')}
                    activeOpacity={.7}                >
                    <Text style={{ color: 'white' }}>tag</Text>
                </TouchableOpacity>
            </View>
            { 
            inputFilter.length>0 &&
            <QuizList request={`/quiz?${filter}=${inputFilter}`} horizontal={false}/>
            }
            
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    searchBar: {
        flexDirection: 'row',
        width: '75%',
        alignItems: 'center',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
        elevation: 2,
    },
    input: {
        width: '100%',
        paddingLeft: 10,
        color: 'white',
        fontSize: 16,
    },
    closeTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
    },
    filterChoices: {
        width: '60%',
        marginVertical: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btnFilter: {
        height: 30,
        color: 'white',
        paddingHorizontal: 30,
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#06A3FF',
        alignItems: 'center',
    },
});