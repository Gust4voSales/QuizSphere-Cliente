import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3D6F95',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    searchBar: {
        flexDirection: 'row',
        width: '75%',
        alignItems: 'center',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#eee',
        elevation: 2,
    },
    input: {
        width: '80%',
        paddingLeft: 10,
        color: 'white',
        fontSize: 16,
    },
    closeTxt: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
    },
    filterChoices: {
        width: '60%',
        marginVertical: 10,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btnFilter: {
        height: 30,
        color: 'white',
        paddingHorizontal: 30,
        borderRadius: 15,
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#06A3FF',
        alignItems: 'center',
    },
});