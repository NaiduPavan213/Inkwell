import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

interface Like {
    user: string;
    post: string;
}

interface LikeButtonProps {
    postId: string;
}

interface DecodedToken {
    user: {
        id: string;
    };
}

const LikeButton: React.FC<LikeButtonProps> = ({ postId }) => {
    const [likes, setLikes] = useState<number>(0);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const auth = useContext(AuthContext);
    const currentUserId = auth?.token ? (jwtDecode(auth.token) as DecodedToken).user.id : null;

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await axios.get<Like[]>(`/api/posts/${postId}/likes`);
                setLikes(res.data.length);
                setIsLiked(res.data.some((like: Like) => like.user === currentUserId));
            } catch (err) {
                console.error("Failed to fetch likes");
            }
        };

        if (postId) {
            fetchLikes();
        }
    }, [postId, currentUserId]);

    const handleLike = async () => {
        if (!auth?.token) {
            alert('Please log in to like posts.');
            return;
        }
        try {
            const config = { headers: { 'x-auth-token': auth.token } };
            await axios.post(`/api/posts/${postId}/like`, {}, config);
            
            const res = await axios.get<Like[]>(`/api/posts/${postId}/likes`);
            setLikes(res.data.length);
            setIsLiked(res.data.some((like: Like) => like.user === currentUserId));
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
