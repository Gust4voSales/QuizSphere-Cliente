import React, { useContext, useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FriendInvitations from '../FriendInvitations';
import Activities from '../Activities';
import { useFocusEffect } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';;


const NotificationsTab = createBottomTabNavigator();

export default function Notifications() {
    const { setNotificationIndicator } = useContext(UserActionsContext);
    
    // When leaving the screen use the useFocusEffect hook from react navigation to know you're leaving and remove notificationIndicator
    useFocusEffect(
        useCallback(() => {
            const unsubscribe = () => {
                setNotificationIndicator(false);
            }

            return () => unsubscribe();
        }, [])
    );

    return(
        <NotificationsTab.Navigator>
            <NotificationsTab.Screen name="Activities" component={Activities}/>
            <NotificationsTab.Screen name="FriendInvitations" component={FriendInvitations}/>
        </NotificationsTab.Navigator>
    );
}
