import React from 'react';

import { UserActionsProvider } from '../contexts/userActions'; //Remove later

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, } from '@react-navigation/drawer';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomDrawer from './components/CustomDrawer';
import Feed from '../screens/Feed';
import FavoriteQuizzes from '../screens/FavoriteQuizzes';
import SharedQuizzes from '../screens/SharedQuizzes';
import CreatedQuizzes from '../screens/CreatedQuizzes';
import PlayQuiz from '../screens/PlayQuiz';
import EndQuizGame from '../screens/EndQuizGame';
import CreateQuiz from '../screens/CreateQuiz';
import SeeFriends from '../screens/SeeFriends';
import AddFriend from '../screens/AddFriend';
import About from '../screens/About';
import Search from '../screens/Search';
import Notifications from '../screens/Notifications';


const AppDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();


function HomePage() {
    return (
        <AppStack.Navigator
            screenOptions={{
                headerShown: false, 
            }}
        > 
            <AppStack.Screen name="Feed" component={Feed} />
            <AppStack.Screen name="FavoriteQuizzes" component={FavoriteQuizzes} />
            <AppStack.Screen name="SharedQuizzes" component={SharedQuizzes} />
            <AppStack.Screen name="CreatedQuizzes" component={CreatedQuizzes} />
            <AppDrawer.Screen name="PlayQuiz" component={PlayQuiz} options={{gestureEnabled: false, unmountOnBlur: true}}/>  
            <AppDrawer.Screen name="EndQuizGame" component={EndQuizGame} options={{gestureEnabled: false, unmountOnBlur: true}}/> 
            <AppStack.Screen name="Search" component={Search}/>
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
                    name="CreateQuiz" 
                    component={CreateQuiz}
                    options={{ 
                        drawerLabel: "Criar quiz",
                        drawerIcon: ({color, size}) => <Icon name="comment-plus" color={color} size={size} 
                            style={{paddingLeft: 10, transform: [{rotateY: '180deg'}, { translateX: -10 }]}}/>
                    }} 
                />
                <AppDrawer.Screen 
                    name="SeeFriends" 
                    component={SeeFriends}
                    options={{ 
                        drawerLabel: "Ver amigos",
                        drawerIcon: ({color, size}) => <Icon name="account-multiple" color={color} size={size} style={iconStyle}/>,
                    }} 
                />
                <AppDrawer.Screen 
                    name="AddFriend" 
                    component={AddFriend}
                    options={{ 
                        drawerLabel: "Adicionar amigos",
                        drawerIcon: ({color, size}) => <Icon name="account-plus" color={color} size={size} style={iconStyle}/>,
                    }} 
                />
                <AppDrawer.Screen 
                    name="About" 
                    component={About}
                    options={{ 
                        drawerLabel: "Sobre",
                        drawerIcon: ({color, size}) => <Icon name="information" color={color} size={size} style={iconStyle}/>,
                    }} 
                />
                   
            </AppDrawer.Navigator>
        </UserActionsProvider>
    );
}

const iconStyle = { 
    paddingLeft: 10,
}