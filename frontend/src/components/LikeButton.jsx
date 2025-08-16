import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

const LikeButton = ({ postId }) => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const { token } = useContext(AuthContext);
    const currentUserId = token ? jwtDecode(token).user.id : null;

    const fetchLikes = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}/likes`);
            setLikes(res.data.length);
            // Check if the current user's ID is in the list of likes
            setIsLiked(res.data.some(like => like.user === currentUserId));
        } catch (err) {
            console.error("Failed to fetch likes");
        }
    };

    useEffect(() => {
        if (postId) {
            fetchLikes();
        }
    }, [postId, currentUserId]);

    const handleLike = async () => {
        if (!token) {
            alert('Please log in to like posts.');
            return;
        }
        try {
            const config = { headers: { 'x-auth-token': token } };
            await axios.post(`/api/posts/${postId}/like`, {}, config);
            fetchLikes(); // Refresh likes after action
        } catch (err) {
            console.error("Failed to update like status");
        }
    };

    return (
        <div className="like-section">
            <button onClick={handleLike} className={`like-button ${isLiked ? 'liked' : ''}`}>
                ❤️ {isLiked ? 'Liked' : 'Like'}
            </button>
            <span className="like-count">{likes} {likes === 1 ? 'like' : 'likes'}</span>
        </div>
    );
};

export default LikeButton;