import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LibraryIcon from './components/LibraryTabIcon';
import Header from './components/Header';
import FeedTrending from '../FeedTrending';
import FeedLibrary from '../FeedLibrary';
import UserActionsContext from '../../contexts/userActions';


const FeedTab = createBottomTabNavigator();

export default function Feed({ navigation }) {

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
            
            <FeedTab.Navigator
                tabBarOptions={tabBarStyling}
            >
                <FeedTab.Screen 
                    name="FeedTrending" 
                    component={FeedTrending} 
                    unmountOnBlur
                    options={{
                        title: 'Em alta',
                        tabBarIcon: ({color, size}) => <Icon name="whatshot" color={color} size={size} />
                    }}
                />
                <FeedTab.Screen 
                    name="FeedLibrary" 
                    component={FeedLibrary} 
                    options={{
                        title: 'Biblioteca',
                        tabBarIcon: ({color, size}) => <LibraryIcon color={color} size={size} />
                    }}
                />
            </FeedTab.Navigator>

            <View style={styles.btnContainer}>
                <Touchable onPress={createQuizHandler} style={styles.createQuizBtn} background={Touchable.SelectableBackgroundBorderless()}>
                    <Icon name="add" size={40} color="#f9f9f9"/>
                </Touchable>
            </View>
        </View>
    );
}

const tabBarStyling = {
    activeTintColor: '#06A3FF',
    tabStyle: {
        justifyContent: 'center',
    },
    labelStyle: {
        fontSize: 12,
        marginTop: -5,
        marginBottom: 5,
    },
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
        bottom: 20, 
        alignSelf: 'center',
        // center: 1,
        // right: '1/2', 
        elevation: 5,
    },
    createQuizBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#06A3FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});