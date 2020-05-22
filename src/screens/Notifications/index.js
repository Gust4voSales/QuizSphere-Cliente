import React, { useContext, useCallback } from 'react';
import FriendInvitations from '../FriendInvitations';
import Activities from '../Activities';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActivitiesTabIcon from './components/ActivitiesTabIcon';
import InvitationsTabIcon from './components/InvitationsTabIcon';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';;


const NotificationsTab = createBottomTabNavigator();

export default function Notifications() {
    return(
        <NotificationsTab.Navigator
            tabBarOptions={tabBarStyling}
        >
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