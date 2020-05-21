import React, { useContext, useCallback, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';
import api from '../../services/api';

// Don't load new Activities when the user opens the app. Just get info if there is new notifications. Load each notification here

//tratar erro (msg no footer do flat?)
export default function Activities() {
    const { newActivity, setNewActivity } = useContext(UserActionsContext);

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (!newActivity) // There are no new activities just load the old ones
            loadActivities();
    }, []);

    useEffect(() => {
        // New activity received then refresh the component state
        if (newActivity) {
            setActivities([]);
            setLoading(false);
            setPage(1);
            setTotalPages(0);
        }
    }, [newActivity]);
    
    useEffect(() => {
        if (activities.length>0) updateSeenActivities();
        
        // Load activities after refreshing (refreshing happens when newActiviry variable from context is set to true)
        if (newActivity && activities.length===0)
            loadActivities();

    }, [activities]);

    // Function called when we leave
    useFocusEffect(
        useCallback(() => {
            const unsubscribe = () => {
                setNewActivity(false);
            }

            return () => unsubscribe();
        }, [])
    );


    const loadActivities = async (page=1) => {
        try {
            setLoading(true);

            const { data } = await api.get(`/user/notifications?page=${page}`);

            setActivities([...data.notifications.docs, ...activities]);
            setTotalPages(data.notifications.totalPages);
            setLoading(false);
        } catch (err) {
            console.log(err)
        }
    }
    
    const loadMoreActivities = () => {
        if (page===totalPages) return;
        
        loadActivities(page+1);
        setPage(oldPage => oldPage+1);
    }

    // Function that sends the activities tha has been seen to update this info in the server
    async function updateSeenActivities() {
        try {
            let activitiesIdsToUpdate = [];

            for (let activity of activities) {
                if (!activity.seen) 
                    activitiesIdsToUpdate.push(activity._id);
            }
            if (activitiesIdsToUpdate.length>0)
                await api.put('/user/notifications/setSeenActivities', activitiesIdsToUpdate);
        } 
        catch (err) {
            console.log(err);
        }
    }

    function renderFooter() {
        if (loading) {
            return(
                <View>
                    <ActivityIndicator />
                </View>
            )
        } 
        return null;
    }

    return(
        <View style={styles.container}>
            <FlatList 
                style={{height: '100%', backgroundColor: '#ddd'}}
                data={activities}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <Text style={styles.activity}>
                        {item.newFriend} aceitou sua solicitação de amizade. {item._id.substring(item._id.length-3, item._id.length)}
                    </Text>
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreActivities}
                onEndReachedThreshold={0.1}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    // },
    activity: {
        height: 60,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 50,
    }
});