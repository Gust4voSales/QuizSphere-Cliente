import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography';


export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    imgBackground: {
        position: 'absolute',
        top: '-15%',
        left: '-5.3%',
        width: '106%',
        height: '80%',
    },
    quizBoxContainer: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '35%',
        // justifyContent: 'space-evenly',
        alignItems: 'center',
        
        // backgroundColor: 'gray'
    },
    headerContainer: {
        // backgroundColor: 'pink',
        paddingVertical: 5,
        marginBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
        width: '80%',
    },
    progressBar: {
        marginBottom: 15,
        // height: 30,
    },
    quizTitle: {
        fontSize: 26,
        color: 'white',
        ...systemWeights.semibold,
        textAlign: 'center',
    },
    

    questionTitle: {
        color: 'white',
        fontSize: 22,
        width: '60%',
        // backgroundColor: 'pink',
        textAlign: 'center',
        alignSelf: 'center',
    },

    optionsContainer: {
        paddingBottom: '30%',
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center'
    },



    rankingContainer: {
        // backgroundColor: 'red'
    },
});