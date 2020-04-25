import 'react-native-gesture-handler';
import React from 'react';
import { View, Button } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/auth';

import CreateQuiz from './src/screens/CreateQuiz';
import Login from './src/screens/Login';

const Stack = createStackNavigator();

function Home({navigation}){
  return (
    <View>
      <Button title="IR criar" onPress={() => {navigation.navigate("CreateQuiz")}}/>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName="Login"
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
          
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="CreateQuiz" component={CreateQuiz} options={{ title: 'Criar Quiz' }}/>
          
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
}
