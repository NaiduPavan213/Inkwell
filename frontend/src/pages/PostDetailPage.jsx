import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import DOMPurify from 'dompurify'; // Import DOMPurify for security

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    // ... (rest of the state variables are the same)
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const currentUserId = token ? jwtDecode(token).user.id : null;

    useEffect(() => {
        // ... (fetchPost logic remains the same)
    }, [id]);

    // Function to create sanitized HTML
    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    };

    // ... (handleDelete logic remains the same)

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-msg">{error}</p>;

    const isAuthor = post && post.author === currentUserId;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <small>Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
            
            {/* Safely render the HTML content from the editor */}
            <div 
                className="post-content" 
                dangerouslySetInnerHTML={createMarkup(post.content)}
            ></div>
            
            {isAuthor && (
                // ... (author actions buttons remain the same)
            )}
        </div>
    );
};

export default PostDetailPage;