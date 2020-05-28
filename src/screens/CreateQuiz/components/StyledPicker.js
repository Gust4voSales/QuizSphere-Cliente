import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View } from 'react-native-animatable';

export default function StyledPicker(props) {
    return(
        <TouchableOpacity style={styles.btn} onPress={null} activeOpacity={0.8}>
            <Picker
                style={styles.picker}
                mode="dropdown"
                selectedValue={props.selection}
                onValueChange={(itemValue, itemIndex) => {
                    props.handler(itemValue);
                }}
            >
                { props.items.map((item, index) => 
                    <Picker.Item label={item.charAt(0).toUpperCase() + item.slice(1)} value={item} key={item}/>) 
                }

            </Picker>
            
            <Icon name='arrow-drop-down' size={30} color='white' style={styles.icon}/>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: '100%', 
        backgroundColor: '#00A3FF', 
        borderRadius: 4,
        marginBottom: 15,
    },
    picker: {
        color: 'white', 
        height: 40,
        backgroundColor: 'transparent',
    },
    icon: {
        position: 'absolute',
        marginTop: 6,   
        right: 0
    }
});