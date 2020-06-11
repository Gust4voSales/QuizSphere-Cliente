import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Touchable from 'react-native-platform-touchable';
import { systemWeights } from 'react-native-typography';
import { useNavigation } from '@react-navigation/native';


export default function ActivityCard({ item }) {
    const navigation = useNavigation();

    function navigateToPage() {
        if (item.activityType==='newFriend')
            navigation.navigate('SeeFriends');
        else // sharedQuiz
            navigation.navigate('SharedQuizzes');
    }

    return(
        <Touchable onPress={navigateToPage}>
        <View style={styles.container}>
            <Icon 
                name={
                    item.activityType==='newFriend'
                    ? 'account-check'
                    : 'comment-account'
                }
                color="white"
                size={25}
                style={{paddingRight: 5}}
            />

            <Text style={styles.textInfo}>
                <Text style={styles.userName}>{item.friendName}</Text>
                {
                    item.activityType==='newFriend'
                    ? ' aceitou sua solicitação de amizade.'
                    : ' compartilhou um quiz com você'
                }
            </Text>
        </View>
        </Touchable>

    );
    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 60,
        alignItems: 'center',
        // backgroundColor: '#ddd',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white'
    },
    userName: {
        fontSize: 18,
        color: 'white',
        paddingTop: 2.5,
        ...systemWeights.bold,
    },
    textInfo: {
        fontSize: 18,
        color: '#ddd',
        flexWrap: 'wrap-reverse',

    },
});