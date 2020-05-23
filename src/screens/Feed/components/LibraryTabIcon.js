import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


export default function LibraryIcon({color, size}) {
    return(
        <Icon name="comment-multiple" color={color} size={size} style={{ transform: [{ rotateY: '180deg' }] }}/>
    );
}