import { StyleSheet, StatusBar } from 'react-native';
import { systemWeights } from 'react-native-typography';

export default StyleSheet.create({
    listContainer:{        
        width: '76%',
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },  
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: 45,
        backgroundColor: '#37506D',
        marginRight: 5,
        borderRadius: 4,
    },
    addBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        backgroundColor: '#37506D',
        marginRight: 5,
        borderRadius: 30,
    },
    footerText: {
        // marginLeft: '12%',
        textAlign: 'center',
        marginTop: -2,
        color: 'white',
        marginBottom: 40,
    },
  
    modalContainer: {
        height: 400,
        // flex: 1,
        // alignSelf: 'flex-start',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#3D6F95',
        marginTop: StatusBar.currentHeight + 20,
    },
    modalExitBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    modelQuestionInput: {
        paddingTop: 5,
        paddingBottom: 10,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        fontSize: 18,
        marginBottom: 2,
    },
   
    questionBtn: {
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#37506D',
        borderRadius: 30,
        marginTop: 8,
        marginBottom: 4,
    },
    editBtnsContainer: { 
        flexDirection: 'row', 
        width: '70%',
        alignItems: 'center',
        justifyContent: 'space-around' 
    },
});