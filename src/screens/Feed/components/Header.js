import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { systemWeights } from 'react-native-typography';
import AuthContext from '../../../contexts/auth';
import UserActionsContext from '../../../contexts/userActions';


export default function Header(props) {
    const { user } = useContext(AuthContext);
    const { notificationIndicator } = useContext(UserActionsContext);

    function displayNotificationCounter() {
        if (notificationIndicator) {
            return <Text style={styles.notificationIndicator}>!</Text>;
        }
    }
    
    return(
        <View style={styles.header}>
            <Touchable background={Touchable.SelectableBackground()} onPress={props.openDrawer} hitSlop={{
                top: 10, bottom: 10, left: 10, right: 10
            }}>
                <View style={styles.userLeftContainer}>
                    <Icon name="menu" size={30} color="white" />
                </View>
            </Touchable>
            
            <View style={styles.iconsRightContainer}>
                <Touchable 
                    background={Touchable.SelectableBackgroundBorderless()} 
                    hitSlop={{ top: 20, left: 4, right: 4, bottom: 20 }}
                    style={{marginRight: 10}}
                >
                    <Icon name="search" size={30} color="white" />
                </Touchable>
                <Touchable 
                    background={Touchable.SelectableBackgroundBorderless()} 
                    hitSlop={{ top: 20, left: 4, right: 4, bottom: 20 }}
                    onPress={props.openNotificationScreen}
                >   
                    <View>
                        <Icon name="notifications" size={30} color="white"/>
                        {displayNotificationCounter()}
                    </View>
                </Touchable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 60, 
        flexDirection: 'row',
        backgroundColor: '#37516D',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        elevation: 10,
    },
    userLeftContainer: {
        flexDirection: 'row',
    },
    userName: {
        color: 'white',
        fontSize: 26,
        textAlignVertical: 'center',
        textAlign: 'center',
        marginRight: -4,
        ...systemWeights.regular,
    },
    iconsRightContainer: {
        flexDirection:'row',
    },

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
});
