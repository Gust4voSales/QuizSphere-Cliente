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
        backgroundColor: '#58AAFF',
        marginRight: 5,
        borderRadius: 4,
    },
    addBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        width: 60,
        backgroundColor: '#58AAFF',
        marginRight: 5,
        borderRadius: 30,
    },
    footerText: {
        marginLeft: '12%',
        marginTop: -2,
        color: 'white',
    },
  
    modalContainer: {
        height: 350,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#3E81A7',
        marginTop: StatusBar.currentHeight + 5,
    },
    modalExitBtn: {
        position: 'absolute',
        right: 0,
        top: 0,
    },
    modelQuestionInput: {
        paddingVertical: 0,
        borderBottomWidth: 1,
        borderColor: '#58AAFF',
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        fontSize: 18,
        marginBottom: 10,
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