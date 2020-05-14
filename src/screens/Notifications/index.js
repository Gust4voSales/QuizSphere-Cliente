import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FriendInvitations from '../FriendInvitations';
import Mentions from '../Mentions';
import UserActionsContext from '../../contexts/userActions';;
import api from '../../services/api';


const NotificationsTab = createBottomTabNavigator();

// When leaving the screen use the useFocusEffect hook from react navigation to know you're leaving and subtract the number of notificatoins
export default function Notifications() {
    return(
        <NotificationsTab.Navigator>
            <NotificationsTab.Screen name="FriendInvitations" component={FriendInvitations}/>
            <NotificationsTab.Screen name="Mentions" component={Mentions}/>
        </NotificationsTab.Navigator>
    );
}
