import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';


export default StyleSheet.create({
    container: {
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        // justifyContent: 'center',
    },
    loginTxt: {
        color: 'white',
        ...systemWeights.bold,
        fontSize: 24,
        letterSpacing: 2,
        marginTop: 10,
        marginBottom: 15,
    },
    input: {
        width: '80%',
        fontSize: 16,
        color: 'white',
        paddingLeft: 34,
    },
    btn: {
        width: '78%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        elevation: 2,
        marginBottom: 20,
    },
    txtBtn: {
        ...systemWeights.semibold,
        fontSize: 20, 
        paddingVertical: 15,
        color: 'white',
        letterSpacing: .7,
    },
});