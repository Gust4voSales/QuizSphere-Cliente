import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons'
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import { systemWeights } from 'react-native-typography';
import  { CommonActions } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import UserActionsContext from '../../contexts/userActions';


export default function CustomDrawerContent(props) {
    const { signOut, user } = useContext(AuthContext);
    const { disconnectSocket } = useContext(UserActionsContext);
    const navigation = props.navigation;
    
    function signOutHandler() {
        navigation.closeDrawer();
        disconnectSocket();
        setTimeout(signOut, 500);
    }

    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView {...props} >
                <View style={styles.header}>
                    <Touchable background={Touchable.SelectableBackground()} onPress={props.navigation.closeDrawer} style={{width: '100%'}}>
                        <View style={styles.userLeftContainer}>
                            <Text style={styles.userName}>{user.userName}</Text>
                            <Icon name="arrow-drop-down" size={25} color="white" style={{alignSelf: 'center', paddingTop: 3, transform: [{ rotate: '-90deg'}], }}/>
                        </View>
                    </Touchable>
                </View>
                {/* Screens */}
                <DrawerItemList {...props}/>  
            </DrawerContentScrollView>
            <DrawerItem
                label="Sair"
                labelStyle={{ color: 'white', fontSize: 16 }}
                icon={({color, size}) => <IconM name="logout" color="white" size={size} style={{ paddingLeft: 10 }}/>}
                onPress={signOutHandler}
                style={styles.signOutContainer}
            />
        </View>

    );
}


const styles = StyleSheet.create({
    header: {
        height: 59, 
        top: -3.5,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#486390'

        // marginBottom: -6,
        // paddingHorizontal: 10,
        // justifyContent: 'space-between',
        // elevation: 10,
    },
    userLeftContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 14.2,
    },
    userName: {
        paddingLeft: 10,
        color: 'white',
        fontSize: 26,
        textAlignVertical: 'center',
        textAlign: 'center',
        marginRight: -4,
        ...systemWeights.regular,
    },
    signOutContainer: {
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        marginLeft: 0, 
        borderRadius:0,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#486390'
    }
});