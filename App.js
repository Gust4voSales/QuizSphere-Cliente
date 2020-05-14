import 'react-native-gesture-handler';
import React from 'react';
import { YellowBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from './src/contexts/auth'
import Routes from './src/routes';

YellowBox.ignoreWarnings([
    'Unrecognized WebSocket',
]);

export default function App() {
    return (
        <NavigationContainer>
            <AuthProvider>
                <Routes />
            </AuthProvider>
        </NavigationContainer>
    );
}