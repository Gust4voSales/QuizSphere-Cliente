import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { systemWeights } from 'react-native-typography';
import AuthContext from '../../contexts/auth';


export default function CustomDrawerContent(props) {
    const { signOut, user } = useContext(AuthContext);
    const navigation = props.navigation;
    
    function signOutHandler() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomePage' }
                ],
            })
        );
        
        signOut();
    }

    return (
        <DrawerContentScrollView {...props} >
            <View style={styles.header}>
                <Touchable background={Touchable.SelectableBackground()} onPress={props.navigation.closeDrawer} style={{width: '100%'}}>
                    <View style={styles.userLeftContainer}>
                        <Text style={styles.userName}>{user.userName}</Text>
                        <Icon name="arrow-drop-down" size={25} color="white" style={{alignSelf: 'center', paddingTop: 3, transform: [{ rotate: '-90deg'}], }}/>
                    </View>
                </Touchable>
            </View>
            <DrawerItemList {...props}/>  
            {/* <DrawerItem
                label="Feed"
                icon={({color, size}) => <Icon name="home" color={color} size={size} />}
                onPress={() => navigation.jumpTo('HomePage')}
            /> */}
            {/* <DrawerItem label="Logout" onPress={ signOutHandler } drawerContentStyles /> */}
        </DrawerContentScrollView>
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
        borderColor: 'white',
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
});