import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ButtonContainer({ name, iconName }) {
    return(
        <View style={styles.container}>
            <Icon name={iconName} color="#00A3FF" size={40} style={styles.icon}/>
            <Text style={styles.title}>{name}</Text>
        </View>
    );  
}

const styles = StyleSheet.create({  
    container: {
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
    },
    icon: {
        // position: 'absolute',
        // left: 10,
        marginLeft: 10,
        marginRight: 20,
        transform: [ { rotateY: '180deg' } ]
    },
    title: {
        fontSize: 22,
        color: 'white',
    }
});