import { StyleSheet } from 'react-native';
import { systemWeights } from 'react-native-typography'


export default StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: '5%',
        alignItems: 'center',
        backgroundColor: '#3D6F95',
    },
   
    informations: {
        flex: 1, 
        width: '80%',
        // height: '40%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },

    horizontalInfoContainer: { 
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        // backgroundColor: '#f9f9',
    },
    
    input: {
        width: '100%',
        color: 'white',
        paddingBottom: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    
    questions: {
        width: '80%',
        // height: '40%',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        // backgroundColor: '#ddd',
    },
    questionsTitle: {
        alignSelf: 'flex-start',
        marginBottom: 15,
        color: 'white',
        fontSize: 24,
    },
    createBtn: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        height: 50,
        // marginBottom: 10,
        backgroundColor: '#00A3FF',
        // backgroundColor: '#37506D',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createBtnText: {
        fontSize: 22, 
        color: 'white', 
        ...systemWeights.semibold, 
        letterSpacing: 1.5,
    },
});