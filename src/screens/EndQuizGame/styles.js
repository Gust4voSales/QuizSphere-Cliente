import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        width: '100%',
        fontSize: 26,
        color: 'white',
        ...systemWeights.semibold,
        textAlign: 'center',
        paddingVertical: 15,
    },
    scoreContainer: {
        width: '80%',
        paddingVertical: 20,
        marginTop: 20,
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: '#3D6F95',
        elevation: 3,
        // alignItems: 'center',
    }, 
    scoreTitle: {
        position: 'absolute',
        top: 10,
        fontSize: 18,
        color: '#fff',
        ...systemWeights.bold,
        alignSelf: 'center',
    },
    scoreFieldContainer: {
        width: '90%',
        flexDirection: 'row', 
        marginBottom: 5,
        alignSelf: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 2,
    },
    scoreText: {
        fontSize: 16,
        color: '#162F48',
        textAlignVertical: 'center',
        ...systemWeights.semibold,
        paddingTop: 2,
        alignSelf: 'flex-start',
    },
    scoreResult: {
        fontSize: 16,
        color: '#162F48',
    },
    btnContainer: {
        position :'absolute',
        bottom: 50,
        height: 130,
        width: '80%',
        justifyContent: 'space-between',
        // backgroundColor: 'pink'
    },
    btn: {
        height: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        marginLeft: 10,
        fontSize: 18,
        ...systemWeights.semibold,
        paddingTop: 2,
    },
    animation: {
        height: 100, 
        width: 100,
        // backgroundColor: '#ddd'
    },
});