import React from 'react';
import { View, } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import ButtonContainer from './components/ButtonContainer';


export default function FeedLibrary({ navigation }) {
    return(
        <View style={{ flex: 1, backgroundColor: '#3D6F95', }}>
            <Touchable background={Touchable.SelectableBackground()} onPress={() => navigation.navigate('FavoriteQuizzes')}>
                <ButtonContainer name="Favoritos" iconName="star"/>
            </Touchable>

            <Touchable background={Touchable.SelectableBackground()} onPress={() => navigation.navigate('SharedQuizzes')}>
                <ButtonContainer name="Compartilhados comigo" iconName="comment-account"/>
            </Touchable>

            <Touchable background={Touchable.SelectableBackground()} onPress={() => navigation.navigate('CreatedQuizzes')}>
                <ButtonContainer name="Criados" iconName="comment-eye"/>
            </Touchable>
        </View>
    );

}

