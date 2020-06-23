import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';

export default StyleSheet.create({
    container: {
        height: 160,
        // height: 260,
        width: 270,
        
        borderRadius: 20,
        elevation: 4,
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between'
    },
    author: {
        color: '#CBCBCB',
        ...systemWeights.bold,
        fontSize: 14,
    },
    quizTitle: {
        color: 'white',
        ...systemWeights.semibold,
        fontSize: 20,
        // backgroundColor: '#ddd'
    },
    infoContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    infoText: {
        color: 'white',
        fontSize: 15,
    },
    actionIcons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    likeCounter: {
        color: '#FFFEFE',
        fontSize: 14,
    },
    privateIcon: {
        position: 'absolute',
        top: 8, 
        right: 18,
    }
});
