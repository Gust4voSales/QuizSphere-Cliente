import React, { useContext } from 'react';
import { View, StyleSheet, } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Header from './components/Header';
import FeedTrendingQuizzes from '../FeedTrendingQuizzes';
import FeedSavedQuizzes from '../FeedSavedQuizzes';
import UserActionsContext from '../../contexts/userActions';


const FeedTab = createBottomTabNavigator();

export default function Feed({ navigation }) {
    navigation.setOptions({
        headerShown: false,
    });
    const { setNotificationsCounter } = useContext(UserActionsContext);


    function openDrawerHandler() {
        navigation.openDrawer();
    }

    function createQuizHandler() {
        navigation.jumpTo('CreateQuiz');
    }

    function openNotificationsHandler() {
        navigation.navigate('Notifications');
    }

    return(
        <View style={{flex: 1, backgroundColor: '#fff'}}>
            <View style={styles.elevationContainer}></View>
            <Header openDrawer={openDrawerHandler} openNotificationScreen={openNotificationsHandler}/>
            
            <FeedTab.Navigator>
                <FeedTab.Screen name="FeedTrendingQuizzes" component={FeedTrendingQuizzes} />
                <FeedTab.Screen name="FeedSavedQuizzes" component={FeedSavedQuizzes} />
            </FeedTab.Navigator>

            <View style={styles.btnContainer}>
                <Touchable onPress={createQuizHandler} style={styles.createQuizBtn} background={Touchable.SelectableBackgroundBorderless()}>
                    <Icon name="add" size={40} color="#06A3FF"/>
                </Touchable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    elevationContainer: {
        position: 'absolute',
        top: 0,
        width: '100%', 
        height: 60, 
        backgroundColor: '#ddd', 
        elevation: 10,
        zIndex: -999,
    },
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