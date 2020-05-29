import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { systemWeights } from 'react-native-typography';


export default function Header({ screenTitle }) {
    const navigation = useNavigation();
    
    function goBackToMainPage() {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    { name: 'HomePage' }
                ],
            })
        );
    }

    return(
        <View style={styles.container}>
            <Touchable 
                background={Touchable.SelectableBackgroundBorderless()}
                onPress={goBackToMainPage}
                style={styles.goBackBtn}
                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
                <Icon name="chevron-left" color="white" size={35} style={{}}/>
            </Touchable>
            <Text style={styles.screenTitle}>{screenTitle}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        height: 60,
        width: '100%',
        backgroundColor: '#38506D',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    goBackBtn: {
        position: 'absolute',
        left: 8,
        
    },
    screenTitle: {
        ...systemWeights.semibold,
        fontSize: 22,
        color: 'white',
        // textAlignVertical: 'center',
    },
});