import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ToastAndroid, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import FriendCard from './components/FriendCard';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';


export default function SeeFriends() {
    const [friends, setFriends] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [refreshing, setRefreshing] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showError, setShowError] = useState(false);
    
    // Load friends each time the user focus this screen
    useFocusEffect(
        useCallback(() => {
            loadFriends();
        }, [])
    );
    
    async function loadFriends(page=1) {
        try {
            setShowError(false);

            if (page===1) // Initial loading indicator
                setRefreshing(true);
            else  // Loading next page
                setLoadingMore(true);            

            const { data } = await api.get(`/user/friend?page=${page}`);

            if (page===1) // refreshing
                setFriends(data.friends.docs);
            else // Loading more friends, so just add to the arrray
                setFriends([...friends, ...data.friends.docs]);

            setTotalPages(data.friends.totalPages);
            setPage(page);
            setRefreshing(false);
            setLoadingMore(false);            
        } catch (err) {
            setRefreshing(false);
            setLoadingMore(false);  
            setShowError(true);
        }
    }

    function userFeedbackAfterPressing (relationId, feedbackMessage, success) {
        ToastAndroid.show(feedbackMessage, ToastAndroid.SHORT);
        if (success) 
            setFriends(friends.filter(relation => relation._id!=relationId));
    }

    function loadMore() {
        if (page===totalPages) return;
        
        loadFriends(page+1);
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


    if (refreshing) {
        return(
            <View style={styles.container}>
                <Header screenTitle="Ver amigos" />

                <ActivityIndicator color="white" size="large" />
            </View>
        );
    }

    if (showError) {
        return(
            <View style={styles.container}>
                <Header screenTitle="Ver amigos" />
                <TouchableOpacity onPress={() => loadFriends()}>
                    <Text style={{ color: 'black', textAlign: 'center' }}>Não foi possível buscar os amigos. Tente novamente.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            <Header screenTitle="Ver amigos" />
            { 
            friends.length===0 &&
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>Não há nada aqui 😅</Text>
            }  
            <FlatList 
                data={friends}
                onRefresh={loadFriends}
                refreshing={refreshing}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <FriendCard 
                        friend={item.recipient.userName} 
                        relationId={item._id} 
                        userFeedbackAfterPressing={userFeedbackAfterPressing}
                    />
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMore}
                onEndReachedThreshold={0.15}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#3D6F95',
    },
});