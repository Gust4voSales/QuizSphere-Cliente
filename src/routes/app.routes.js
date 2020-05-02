import React, { useContext } from 'react';

import { View, Button, Text } from 'react-native'; //Remove later
import AuthContext from '../contexts/auth'; //Remove later

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView,  DrawerItem, DrawerItemList } from '@react-navigation/drawer';

import FeedHotQuizzes from '../screens/FeedHotQuizzes';
import CreateQuiz from '../screens/CreateQuiz';


const AppDrawer = createDrawerNavigator();
const AppStack = createStackNavigator();


//   <View>
//     <Button title="IR criar" onPress={() => {navigation.navigate("CreateQuiz")}}/>
//     <Button title="Feed" onPress={() => {navigation.navigate("Feed")}}/>
//     <Button title="Logout" onPress={signOut}/>
//   </View>


function HomePage() {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="FeedHotQuizzes" component={FeedHotQuizzes} />
            <AppStack.Screen name="CreateQuiz" component={CreateQuiz} />
            {/* <AppStack.Screen name="Search" component={() => <View><Text>SEARCH</Text></View>} /> */}
        </AppStack.Navigator>
    );
}

// <AppStack.Navigator
        //     initialRouteName="Home"
        //     screenOptions={{
        //     headerStyle: {
        //         backgroundColor: '#37516D',
        //     },
        //     headerTitleStyle: {
        //         fontSize: 26,
        //     },
        //     headerTintColor: '#fff',
        //     headerTitleAlign: 'center',
        //     }}
        // >
        //     <AppStack.Screen name="Home" component={Home} />
        //     <AppStack.Screen name="Feed" component={Feed} />
        //     <AppStack.Screen name="CreateQuiz" component={CreateQuiz} />
        // </AppStack.Navigator>
function CustomDrawerContent(props) {
    const { signOut } = useContext(AuthContext);

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />  
            <DrawerItem label="Logout" onPress={ signOut } />
        </DrawerContentScrollView>
    );
}

export default function AppRoutes(){
    return (
        <AppDrawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
            <AppDrawer.Screen name="HomePage" component={HomePage} />
            <AppDrawer.Screen name="CreateQuiz" component={CreateQuiz} />
        </AppDrawer.Navigator>
    );
}
