import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const { token } = useContext(AuthContext);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}/comments`);
            setComments(res.data);
        } catch (err) {
            console.error("Failed to fetch comments");
        }
    };

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`/api/posts/${postId}/comments`, { text: newComment }, config);
            setNewComment('');
            fetchComments(); // Refresh comments after posting
        } catch (err) {
            alert('Failed to post comment. Please log in.');
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