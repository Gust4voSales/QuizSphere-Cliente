import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';

export default function Option(props) {
    function optionSelectorHandler(){
        props.correctOptionHandler(parseInt(props.option));
    }

    return(
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            <TextInput 
                style={[styles.questionOptionInput, {
                    backgroundColor: props.correctOption 
                        ? '#13F4A3'
                        : '#DFF2FF'
                    }]}
                onChangeText={text => {
                    props.setQuestionOption(text)
                }}            
                value={props.value}
                maxLength={52}
                placeholder={'Opção '+props.option}
            />
            <Touchable 
                style={styles.optionSelector} 
                onPress={optionSelectorHandler}
                background={Touchable.SelectableBackgroundBorderless()}
            >
                <View style={[styles.backgroundOptionSelector, { 
                    backgroundColor: props.correctOption 
                        ? '#58AAFF'
                        : 'transparent'
                    }]} 
                />
            </Touchable>
        </View>
    );
}

const styles = StyleSheet.create({
    questionOptionInput: {
        width: '60%',
        borderRadius: 20,
        textAlign: 'center',
        color: '#162F48',
        marginRight: 15,
        elevation: 3,
    },
    optionSelector: {
        borderColor: 'white',
        width: 20,
        height: 20,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backgroundOptionSelector: {
        width: 14,
        height: 14,
        borderRadius: 7,
    },
});