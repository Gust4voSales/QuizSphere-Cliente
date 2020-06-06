import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function FriendCard({ friend, relationId, index }) {
    return(
        <View style={styles.container}>
            <Text>{friend}</Text>
            <Text>{index}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        marginBottom: 100,
        backgroundColor: '#ddd',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
    },

});