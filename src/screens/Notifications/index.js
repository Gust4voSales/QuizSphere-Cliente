import React, { useContext, useCallback } from 'react';
import { View } from 'react-native';
import FriendInvitations from '../FriendInvitations';
import Activities from '../Activities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import Touchable from 'react-native-platform-touchable';
import ActivitiesTabIcon from './components/ActivitiesTabIcon';
import InvitationsTabIcon from './components/InvitationsTabIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';
;


const NotificationsTab = createBottomTabNavigator();

export default function Notifications({ navigation }) {

    return(
        <View style={{flex: 1}}>
            <Header screenTitle="Notificações"/>

            <NotificationsTab.Navigator tabBarOptions={tabBarStyling}>
                <NotificationsTab.Screen 
                    name="Activities" 
                    component={Activities}
                    options={{
                            title: 'Atividade',
                            tabBarIcon: ({color, size}) => <ActivitiesTabIcon color={color} size={size} />
                    }}
                />  
                <NotificationsTab.Screen 
                    name="FriendInvitations" 
                    component={FriendInvitations}
                    options={{
                            title: 'Solicitações de amizade',
                            tabBarIcon: ({color, size}) => <InvitationsTabIcon color={color} size={size} />
                    }}
                />  
            </NotificationsTab.Navigator>
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