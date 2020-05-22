import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { systemWeights } from 'react-native-typography';
import UserActionsContext from '../../../contexts/userActions';


export default function ActivitiesTabIcon({color, size}) {
    const { newActivity } = useContext(UserActionsContext);

    function displayNotificationIndicator() {
        if (newActivity) {
            return <Text style={styles.notificationIndicator}>!</Text>;
        }
    }

    return(
        <View>
            <Icon name="inbox" color={color} size={size} />
            {displayNotificationIndicator()}
        </View>
    );
}

const styles = {
    notificationIndicator: {
        ...systemWeights.bold,
        fontSize: 16,
        position: 'absolute',
        top: -5, 
        right: -4,
        backgroundColor: '#06A3FF',
        height: 20,
        width: 20,
        borderRadius: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#fff',
    },
}