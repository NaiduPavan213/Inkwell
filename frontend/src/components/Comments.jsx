import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        // Move the function definition inside the effect
        const fetchComments = async () => {
            try {
                const res = await axios.get(`/api/posts/${postId}/comments`);
                setComments(res.data);
            } catch (err) {
                console.error("Failed to fetch comments",err.response);
            }
        };

        if (postId) {
            fetchComments();
        }
    }, [postId]); // The dependency array is now correct

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`/api/posts/${postId}/comments`, { text: newComment }, config);
            setNewComment('');
            
            // Refetch comments after posting a new one
            const res = await axios.get(`/api/posts/${postId}/comments`);
            setComments(res.data);

        } catch (err) {
            alert('Failed to post comment. Please log in.',err.response);
        }
    };

    return (
        <div className="comments-section">
            <h3>Comments</h3>
            {token ? (
                <form onSubmit={handleCommentSubmit} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        rows="3"
                        required
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            ) : (
                <p>You must be logged in to comment.</p>
            )}

            <div className="comments-list">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <div key={comment._id} className="comment-item">
                            <p className="comment-text">{comment.text}</p>
                            <small className="comment-author">by {comment.authorUsername} on {new Date(comment.createdAt).toLocaleDateString()}</small>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default Comments;