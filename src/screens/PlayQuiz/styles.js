import { StyleSheet, Dimensions } from 'react-native';
import { systemWeights } from 'react-native-typography';

const { width } = Dimensions.get('window');
export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'space-between',
    },
    
    quizBoxContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        marginBottom: 15,
        // backgroundColor: 'gray'
    },
    headerContainer: {
        // backgroundColor: 'pink',
        paddingVertical: 5,
        marginBottom: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'white',
        width: '90%',
    },
    progressBar: {
        marginBottom: 15,
        // height: 30,
    },
    quizTitle: {
        fontSize: 24,
        color: 'white',
        ...systemWeights.semibold,
        textAlign: 'center',
    },
    

    questionTitle: {
        color: 'white',
        fontSize: 22,
        // width: '80%',
        width: width-60,
        // backgroundColor: 'pink',
        textAlign: 'center',
        alignSelf: 'center',
    },

    optionsContainer: {
        flex: 1.2,
        // backgroundColor: '#ddd',
        width: '85%',
        justifyContent: 'center',
        alignItems: 'center'
    },
});