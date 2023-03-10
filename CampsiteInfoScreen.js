import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import { Rating, Input } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { postComment } from '../features/comments/commentsSlice';

const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;
    const comments = useSelector((state) => state.comments);
    const [showModal, setShowModal] = useState(false); 
    const [favorite, setFavorite] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');
    
    const dispatch = useDispatch();
    const handleSubmit = () => {
        const newComment = {
            author,rating,text,campsiteId:campsite.id
        }
        dispatch(postComment(newComment))
        setShowModal(!showModal)
    }

    const resetForm = () => {
        setRating(5);
        setAuthor('');
        setText('');
    }

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                <Rating 
                    startingValue={item.rating}
                    imageSize={10}
                    style={{alignItems:'flex-start',paddingVertical:'5%'}}
                    readonly
                />
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <>
        <FlatList
            data={comments.commentsArray.filter(
                (comment) => comment.campsiteId === campsite.id
            )}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
                marginHorizontal: 20,
                paddingVertical: 20
            }}
            
            ListHeaderComponent={
                <>
                    <RenderCampsite
                        campsite={campsite}
                        isFavorite={favorite}
                        markFavorite={() => setFavorite(true)}
                        onShowModal={() => setShowModal(!showModal)}
                    />
                    <Text style={styles.commentsTitle}>Comments</Text>
                </>
            }
        />
            <Modal
            animationType='slide'
            transparent={false}
            visible = {showModal}
            onRequestClose={() => setShowModal(!showModal) }>
            <View style={styles.modal}>
                <Rating 
                showRating
                startingValue={rating}
                imageSize={40}
                onFinishRating = {(rating) => setRating(rating)}
                style={{paddingVertical:10}}
                />
                <Input 
                placeholder='Author'
                leftIcon={{name:'user-0',type:'font-awesome'}}
                leftIconContainerStyle={{paddingRight:10}}
                onChangeText= {(author) => setAuthor(author)}
                value={author}
                />
                <Input 
                placeholder='comment'
                leftIcon={{name:'comment-0',type:'font-awesome'}}
                leftIconContainerStyle={{paddingRight:10}}
                onChangeText={(comment) => setText(comment)}
                value={text}
                />
                <View>
                    <Button 
                    title='submit'
                    color='#5637dd'
                    onPress = {() => {
                        handleSubmit()
                        resetForm()
                    }}
                    />
                </View>
                <View style={{margin:10}}>
                    <Button 
                    title='cancel'
                    color='#808080'
                    onPress = {()=> { 
                        setShowModal(!showModal)
                        resetForm()
                    }}
                    />
                </View> 
                
            </View> 

            
            </Modal>
            </>
    );
    
};


const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal:{
        justifyContent:'center',
        margin: 20
    }
});

export default CampsiteInfoScreen;