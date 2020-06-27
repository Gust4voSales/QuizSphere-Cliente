import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, ToastAndroid, ActivityIndicator, TouchableOpacity, } from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { systemWeights } from 'react-native-typography';
import UserActions from '../../../contexts/userActions';
import api from '../../../services/api';



export default function ShareQuizModal({ quizId, toggleModal, visible }) {
    const isMounted = useRef();
    const { shareQuiz } = useContext(UserActions);

    const [friends, setFriends] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showError, setShowError] = useState(false);
    const [friendsToShare, setFriendsToShare] = useState([]);


    useEffect(() => {
        isMounted.current = true;
        loadFriends();

        return () => { isMounted.current = false }
    }, [visible]);

    async function loadFriends(page=1) {
        try {
            setShowError(false);
            setLoading(true);
            setFriends([]);
            setFriendsToShare([]);
            
            if (page!=1) 
                setLoadingMore(true);

            const { data } = await api.get(`/friends?page=${page}`);

            if (isMounted.current) {
                if (page===1) 
                    setFriends(data.friends.docs);
                else // Loading more friends, so just add to the arrray
                    setFriends([...friends, ...data.friends.docs]);
                
                setTotalPages(data.friends.totalPages);
                setPage(page);
                setLoading(false);
                setLoadingMore(false);  
            }
        } catch (err) {
            console.log(err);
            if (isMounted.current) {
                setLoading(false);
                setLoadingMore(false);  
                setShowError(true);
            }
        }
    }

    function loadMore() {
        if (page===totalPages) return;
        
        loadFriends(page+1);
    }

    function toggleFriendSelection(friendId) {
        if (friendsToShare.includes(friendId)) {
            setFriendsToShare(friendsToShare.filter(id => id!=friendId));
        } else {
            setFriendsToShare([...friendsToShare, friendId]); 
        }
    }

    function onSend() {
        if (friendsToShare.length===0) {
            ToastAndroid.show('Selecione pelo menos um amigo', ToastAndroid.SHORT);
            return;
        }
        shareQuiz(quizId, friendsToShare);
        toggleModal();
    }

    function renderFooter() {
        if (loadingMore) {
            return(
                <View>
                    <ActivityIndicator color="white" size="small"/>
                </View>
            )
        } 
        return null;
    }

    function renderFriendList() {
        if (showError) {
            return(
                <TouchableOpacity onPress={() => loadFriends()}>
                    <Text style={{ color: 'black' }}>Não foi possível carregar os seus amigos.</Text>
                </TouchableOpacity>
            );
        } 
        if (friends.length===0) {
            return <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Nenhum amigo 😢</Text>
        }

        return(
            <> 
            <FlatList 
                data={friends}
                style={{flex: 1, width: '100%'}}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <TouchableOpacity onPress={() => toggleFriendSelection(item.recipient._id)} >
                        <Text 
                            style={[styles.friendCard, 
                                { backgroundColor: friendsToShare.includes(item.recipient._id) ? '#38506F': 'transparent' }]}
                        >
                            {item.recipient.userName}
                        </Text>
                        {friendsToShare.includes(item.recipient._id) && <Icon name="check" color="white" size={20} style={styles.checkFriendIcon}/> }
                    </TouchableOpacity>
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
            />
            <TouchableOpacity onPress={onSend} style={styles.sendBtn} activeOpacity={0.7}>
                <Icon name="send" color="white" size={25} style={{marginLeft: 3,}}/>
            </TouchableOpacity>
            </>
        );
    }

    return(
        <Modal 
            isVisible={visible}
            onBackButtonPress={toggleModal}
            onBackdropPress={toggleModal}
            useNativeDriver
        >
            <View style={styles.container}>
                <Text style={styles.title}>Compartilhar com...</Text>
                <Touchable onPress={toggleModal} style={styles.exitBtn} 
                    background={Touchable.SelectableBackgroundBorderless()} 
                    hitSlop={{ top: 5, bottom: 5, left: 5, right: 5}}
                >
                    <Icon name="close" color="white" size={30} />
                </Touchable>

                {
                    loading 
                    ? <View style={{flex: 1}}><ActivityIndicator color="white" size="large" /></View>
                    : renderFriendList()
                }   
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 350,
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
    sendBtn: {
        position: 'absolute',
        bottom: 15, 
        right: 15,
        height: 50, 
        width: 50,
        backgroundColor: '#00A3FF',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    title: {
        color: 'white',
        fontSize: 20,
        marginTop: 5,
        paddingLeft: 10,
        alignSelf: 'flex-start',
        width: '100%',
        paddingBottom: 8, 
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    friendCard: {
        textAlign: 'left',
        color: 'white',
        width: '100%',
        ...systemWeights.bold,
        paddingVertical: 15, 
        paddingLeft: 10,
        marginBottom: 2
    },
    checkFriendIcon: {
        position: 'absolute',
        right: 10,
        top: 15
    }
});