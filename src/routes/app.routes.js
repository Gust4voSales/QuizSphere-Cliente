import React, { useContext } from 'react';

import AuthContext from '../contexts/auth'; 
import UserActionsContext, { UserActionsProvider } from '../contexts/userActions'; //Remove later

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawer from './components/CustomDrawer';
import Feed from '../screens/Feed';
import CreateQuiz from '../screens/CreateQuiz';
import PlayQuiz from '../screens/PlayQuiz';
import AddFriend from '../screens/AddFriend';
import Notifications from '../screens/Notifications';


const AppDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();


function HomePage() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Feed" component={Feed} />
            <AppStack.Screen name="PlayQuiz" component={PlayQuiz} options={{ headerShown: false }}/>
            <AppStack.Screen name="Notifications" component={Notifications}/>
        </AppStack.Navigator>
    );
}


export default function AppRoutes(){
    return (
        <UserActionsProvider>
            <AppDrawer.Navigator 
                drawerContent={props => <CustomDrawer {...props} />}
                initialRouteName="HomePage"
                backBehavior="initialRoute"
                drawerStyle={{ backgroundColor: '#37516D',}}
                drawerContentOptions={{
                    itemStyle: { marginHorizontal: 0, borderRadius: 0, },
                    activeTintColor: "#06A3FF",
                    activeBackgroundColor: "#486381",
                    inactiveTintColor: "white",
                    labelStyle: { fontSize: 16, },
                }} 
            >
                <AppDrawer.Screen 
                    name="HomePage" 
                    component={HomePage} 
                    options={{ 
                        drawerLabel: "Início",
                        drawerIcon: ({color, size}) => <Icon name="home" color={color} size={size} style={iconStyle}/>
                    }} 
                />
                <AppDrawer.Screen 
                    name="AddFriend" 
                    component={AddFriend}
                    options={{ 
                        drawerLabel: "Adicionar amigos",
                        drawerIcon: ({color, size}) => <Icon name="person-add" color={color} size={size} style={iconStyle}/>
                    }} 
                />
                <AppDrawer.Screen 
                    name="CreateQuiz" 
                    component={CreateQuiz}
                    options={{ 
                        drawerLabel: "Criar quiz",
                        drawerIcon: ({color, size}) => <IconM name="comment-plus" color={color} size={size} style={ {transform: [{rotateY: '180deg'}, { translateX: -10 }]}}/>
                    }} 
                />


            </AppDrawer.Navigator>
        </UserActionsProvider>
    );
}

const drawerContentStyles = {
    activeTintColor: '#06A3FF',
    activeBackgroundColor: '#486381',
    inactiveTintColor: 'white'
}

// const lastItem = {borderBottomWidth: StyleSheet.hairlineWidth,
//     borderColor: '#486390'}

const iconStyle = { 
    paddingLeft: 10,
}