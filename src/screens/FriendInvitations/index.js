import React, { useContext, useState, useEffect, useRef, } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, ToastAndroid } from 'react-native';
import FriendInvitationCard from './components/FriendInvitationCard';
import { useIsFocused } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';
import api from '../../services/api';


export default function Activities() {
    const isMounted = useRef();
    const isTabFocused = useIsFocused();
    const { friendInvitations, setFriendInvitations, } = useContext(UserActionsContext);
    
    const [invitations, setInvitations] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showError, setShowError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        isMounted.current = true;

        loadInvitations();

        return () => { isMounted.current = false }
    }, []);


    useEffect(() => {
        // New invitations received, should update
        if (friendInvitations) 
            loadInvitations();
    }, [friendInvitations]);


    async function loadInvitations(page=1) {
        try {
            setShowError(false);
            if (page===1)  // Initial loading indicator
                setRefreshing(true);
            else  // Loading next page
                setLoadingMore(true); 

            const { data } = await api.get(`/user/friend/pendingInvitations?page=${page}`);

            if (isMounted.current) {
                if (page===1) // refreshing
                    setInvitations(data.invitations.docs);
                else // Loading more invitations, so just add to the arrray
                    setInvitations([...invitations, ...data.invitations.docs]);

                if (isTabFocused)
                    setFriendInvitations(false);

                setTotalPages(data.invitations.totalPages);
                setPage(page);
                setRefreshing(false);
                setLoadingMore(false);    
            }
            
        } catch (err) {
            console.log(err);
            if (isMounted.current) {
                setRefreshing(false);
                setLoadingMore(false);    
                setShowError(true);
            }
        }
    }

    function loadMore() {
        if (page===totalPages) return;
        
        loadInvitations(page+1);
    }

    function userFeedbackAfterPressing(recipientId, feedbackMessage, success) {
        ToastAndroid.show(feedbackMessage, ToastAndroid.SHORT);
        if (success) 
            setInvitations(invitations.filter(invitation => invitation.recipient._id!=recipientId));
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


    // Render returns
    if (refreshing) {
        return(
            <View style={styles.container}>
                <ActivityIndicator size="large" color="white"/>
            </View>
        );
    }
    
    if (showError) {
        return(
            <View style={styles.container}>
                <TouchableOpacity onPress={() => loadInvitations()}>
                    <Text style={{ color: 'black', textAlign: 'center' }}>Não foi possível buscar as solicitações de amizade. Tente novamente.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            {
            invitations.length===0 &&
            <Text style={styles.emptyInfoText}>Não há nada aqui 😅</Text>
            }
            <FlatList 
                style={{flex: 1}}
                onRefresh={loadInvitations}
                refreshing={refreshing}
                data={invitations}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <FriendInvitationCard user={item} userFeedbackAfterPressing={userFeedbackAfterPressing}/>
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
    emptyInfoText: {
        color: 'white',
        fontSize: 18,
        position: 'absolute',
        alignSelf: 'center',
        top: 5
    },
   
});