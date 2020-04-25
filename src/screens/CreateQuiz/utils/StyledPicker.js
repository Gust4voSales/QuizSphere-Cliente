import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function StyledPicker(props) {
    return(
        <TouchableOpacity style={styles.picker} onPress={null} activeOpacity={0.9}>
            <Picker
                style={{ color: 'white', backgroundColor: 'transparent', height: 40,}}
                mode="dropdown"
                selectedValue={props.selection}
                onValueChange={(itemValue, itemIndex) => {
                    props.handler(itemValue)
                }}
            >
                <Picker.Item label="Educativo" value="educativo" />
                <Picker.Item label="Entretenimento" value="entretenimento" />
            </Picker>
            
            <Icon name='arrow-drop-down' size={30} color='white' style={styles.icon}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    picker: {
        width: '54%', 
        backgroundColor: '#58AAFF',
        borderRadius: 4,
    },

    icon: {
        position: 'absolute',
        marginTop: 6,   
        right: 0
    }
});