import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tag from '../../TagComponent';


export default function QuizTagsModal({ tags, toggleModal, visible }) {
    return( 
        <Modal 
            isVisible={visible}
            onBackButtonPress={toggleModal}
            onBackdropPress={toggleModal}
            useNativeDriver
        >
            <View style={styles.container}>
                <Text style={styles.title}>Tags</Text>
                <Touchable onPress={toggleModal} style={styles.exitBtn} 
                    background={Touchable.SelectableBackgroundBorderless()} 
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5}}
                >
                    <Icon name="close" color="white" size={30} />
                </Touchable>

                {
                    tags.length === 0
                    ? <Text style={styles.tagsContainer}>Nenhuma tag</Text>
                    : <View style={styles.tagsContainer}>
                        {
                            tags.map( tag => <Tag tagName={tag} key={tags.indexOf(tag)} /> )
                        }
                      </View>
                }
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: '#3D6F95',
        borderRadius: 3,
    },
    exitBtn: {
        position: 'absolute',
        top: 5, 
        right: 5
    },
    title: {
        color: 'white',
        fontSize: 20,
        marginTop: 5,
        // textAlign: 'center',
        paddingLeft: 10,
        alignSelf: 'flex-start',
        width: '100%',
        paddingBottom: 8, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    tagsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    
});