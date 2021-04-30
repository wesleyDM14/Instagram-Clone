import { db } from './firebase.js';
import firebase from 'firebase';
import { useEffect, useState } from 'react';

function Post(props) {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        db.collection('posts').doc(props.id).collection('comments').orderBy('timestamp', 'desc').onSnapshot(function (snapshot) {
            setComments(snapshot.docs.map(function (document) {
                return { id: document.id, info: document.data() }
            }));
        });
    }, []);

    function coment(id, e) {
        e.preventDefault();
        let actualComment = document.getElementById('comment-' + id).value;
        db.collection('posts').doc(id).collection('comments').add({
            name: props.user,
            comment: actualComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById('comment-' + id).value = "";
    }
    return (
        <div className='postSingle'>
            <img src={props.info.image} />
            <p><b>{props.info.userName}</b>: {props.info.title}</p>
            <div className="comments-div">
                {
                    comments.map(function (val) {
                        return (
                            <div className="comment-single">
                                <p><b>{val.info.name}</b>: {val.info.comment}</p>
                            </div>
                        )
                    })
                }         
            </div>
            {
                (props.user)?
                <form onSubmit={(e) => coment(props.id, e)}>
                <textarea id={"comment-" + props.id}></textarea>
                <input type="submit" value="Comentar" />
            </form>
            :
            <div></div>
            }
            
        </div>
    )
}

export default Post;