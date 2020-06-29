import React, { useContext, useState, useEffect, useRef, } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import ActivityCard from './components/ActivityCard';
import { useIsFocused } from '@react-navigation/native';
import UserActionsContext from '../../contexts/userActions';
import api from '../../services/api';


export default function Activities() {
    const isMounted = useRef();
    const isTabFocused = useIsFocused();
    const { newActivity, setNewActivity } = useContext(UserActionsContext);
    
    const [activities, setActivities] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showError, setShowError] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        isMounted.current = true;

        loadActivities();

        return () => { isMounted.current = false }
    }, []);

    useEffect(() => {
        // When new activities have been added, update them as seen 
        if (activities.length>0) 
            updateSeenActivities();
    }, [activities]);

    useEffect(() => {
        // New activity received, should update
        if (newActivity) 
            loadActivities();
    }, [newActivity]);


    async function loadActivities(page=1) {
        try {
            setShowError(false);
            if (page===1)  // Initial loading indicator
                setRefreshing(true);
            else  // Loading next page
                setLoadingMore(true); 

            const { data } = await api.get(`/notifications?page=${page}`);

            if (isMounted.current) {
                if (page===1) // refreshing
                    setActivities(data.activities.docs);
                else // Loading more activities, so just add to the arrray
                    setActivities([...activities, ...data.activities.docs]);

                if (isTabFocused)
                    setNewActivity(false);

                setTotalPages(data.activities.totalPages);
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
        
        loadActivities(page+1);
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

    async function updateSeenActivities() {
        try {
            let activitiesIdsToUpdate = [];

            for (let activity of activities) {
                if (!activity.seen) 
                    activitiesIdsToUpdate.push(activity._id);
            }
            
            if (activitiesIdsToUpdate.length>0)
                await api.put('/notifications/setasread', activitiesIdsToUpdate);
        } 
        catch (err) {
            console.log(err);
        }
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
                <TouchableOpacity onPress={() => loadActivities()}>
                    <Text style={{ color: 'black', textAlign: 'center' }}>Não foi possível buscar as atividades. Tente novamente.</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return(
        <View style={styles.container}>
            {
            activities.length===0 &&
            <Text style={styles.emptyInfoText}>Não há nada aqui 😅</Text>
            }
            <FlatList 
                style={{flex: 1}}
                onRefresh={loadActivities}
                refreshing={refreshing}
                data={activities}
                keyExtractor={item => item._id}
                renderItem={({item, index, separator}) => (
                    <ActivityCard item={item} />
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