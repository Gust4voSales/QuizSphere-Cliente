import { Alert } from 'react-native';

export default function showAlertError(title, message){
    Alert.alert(
        title,
        message,
        [
            { text: 'OK', onPress: () => null },
        ],
        { cancelable: true },
    );
}
