import React, { useContext, useState, useEffect, } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, ToastAndroid } from 'react-native';
import ActivityCard from './components/ActivityCard';
import { useIsFocused } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';
import api from '../../services/api';


export default function Activities() {
    const isTabFocused = useIsFocused();
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

    // Check if the tab is focused, if so setNewActivity to false because the user is seeing his activities
    useEffect(() => { 
        if (isTabFocused) setNewActivity(false);
    }, [isTabFocused, activities]);


    const loadActivities = async (page=1) => {
        try {
            setLoading(true);
            
            const { data } = await api.get(`/user/notifications?page=${page}`);
            
            setActivities([...data.notifications.docs, ...activities]);
            setTotalPages(data.notifications.totalPages);
            setLoading(false);
        } catch (err) {
            console.log(err) 
            setLoading(false);
            ToastAndroid.show('Não foi possível carregar as atividades', ToastAndroid.SHORT);
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
                    <ActivityIndicator color="white" />
                </View>
            )
        } 
        return null;
    }

    return(
        <View style={styles.container}>
            <FlatList 
                style={{flex: 1}}
                data={activities}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <ActivityCard item={item}/>
                )}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreActivities}
                onEndReachedThreshold={0.1}
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