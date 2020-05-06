import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeedHotQuizzes from '../FeedHotQuizzes';
import FeedSavedQuizzes from '../FeedSavedQuizzes';


const AppTab = createBottomTabNavigator();

export default function Feed({ navigation }) {
    function createQuizHandler() {
        navigation.jumpTo('CreateQuiz');
    }

    return(
        <View style={{flex: 1}}>
            <AppTab.Navigator>
                <AppTab.Screen name="FeedHotQuizzes" component={FeedHotQuizzes} />
                <AppTab.Screen name="FeedSavedQuizzes" component={FeedSavedQuizzes} />
            </AppTab.Navigator>

            <View style={styles.btnContainer}>
                <Touchable onPress={createQuizHandler} style={styles.createQuizBtn} background={Touchable.SelectableBackgroundBorderless()}>
                    <Icon name="add" size={40} color="#06A3FF"/>
                </Touchable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    btnContainer: {
        borderRadius: 30, 
        position: 'absolute',
        bottom: 30, 
        right: 20, 
        elevation: 5,
    },
    createQuizBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F9F9F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
});