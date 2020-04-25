import React, { useState, useRef, useEffect }  from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert } from 'react-native';
import TagComponent from '../../../components/TagComponent';
import { set } from 'react-native-reanimated';

export default function TitleInput(props) {
    const scroll = useRef();
    const [tagText, setTagText] = useState('');
    const [tags, setTags] = useState([]);
    const [tagCounter, setTagCounter] = useState(0);

    useEffect(() => {
        props.onTagsChange(tags);
    }, [tags]);

    function createTag(){
        if (tags.length===5){
            Alert.alert('', 'Máximo de tags excedido');
            setTagText('');
            return;
        } else if (tagText===' ' || tagText===''){
            return;
        } 

        const newTag = { 
            name: tagText, 
            key: tagCounter.toString() 
        }

        setTags([...tags, newTag]);
        setTagText('');
        setTagCounter(tagCounter+1);
        setTimeout(() => {
            scroll.current.scrollToEnd();
        }, 500);
    }

    function deleteTagHandler(key){
        let newTags = tags.filter(tag => tag.key != key);
        
        setTags(newTags);
    }

    function keyPressHandler({ nativeEvent }){
        let key = nativeEvent.key;

        if(key===' '){
            setTagText(tagText.trim());
            createTag();
        }
    }

    return(
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                placeholder="Tags"
                placeholderTextColor="#bbb"
                maxLength={20}
                underlineColorAndroid='#58AAFF'
                onSubmitEditing={createTag}
                onKeyPress={keyPressHandler}
                onChangeText={text => {
                    setTagText(text);
                }}
                value={tagText}
            />
           
            <View style={styles.tagContainer}>
                <FlatList
                    style={{flexGrow: 0}}
                    ref={scroll}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={tags}
                    keyExtractor={item => item.key}
                    renderItem={({item, index, separators}) => 
                        <TagComponent tagName={item.name} key={item.key} showDeleteBtn onDelete={() => deleteTagHandler(item.key)}/>
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        // flexWrap: 'wrap'
        marginBottom: 10,
    },
    input: {
        // flex: 2,
        width: '100%',
        color: 'white',
        paddingBottom: 8,
        fontSize: 16,
        // backgroundColor: '#ddd',
        // opacity: 0.3,
    },
    tagContainer: {
        width: '90%',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

});
