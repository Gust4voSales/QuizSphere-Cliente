import React, { useContext } from 'react';

import { View, Button } from 'react-native'; //Remove later
import AuthContext from '../contexts/auth'; //Remove later

import { createStackNavigator } from '@react-navigation/stack';

import CreateQuiz from '../screens/CreateQuiz';

const AppStack = createStackNavigator();

function Home({navigation}){
    const { signOut } = useContext(AuthContext);
    return (
      <View>
        <Button title="IR criar" onPress={() => {navigation.navigate("CreateQuiz")}}/>
        <Button title="Logout" onPress={signOut}/>
      </View>
    )
}

export default function AppRoutes(){
    return(
        <AppStack.Navigator
            initialRouteName="Home"
            screenOptions={{
            headerStyle: {
                backgroundColor: '#37516D',
            },
            headerTitleStyle: {
                fontSize: 26,
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            }}
        >
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="CreateQuiz" component={CreateQuiz} />
        </AppStack.Navigator>
    );
}
