import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import DOMPurify from 'dompurify';

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true); // This was missing
    const [error, setError] = useState('');     // This was missing
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const currentUserId = token ? jwtDecode(token).user.id : null;

    // This logic was missing
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Post not found.',err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const createMarkup = (html) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    // This logic was missing
    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const config = { headers: { 'x-auth-token': token } };
                await axios.delete(`/api/posts/${id}`, config);
                navigate('/');
            } catch (err) {
                alert('Failed to delete post. You might not be the author.',err.response);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-msg">{error}</p>;

    // Important: Check if post exists before trying to render it
    if (!post) return <p>Post not found.</p>;

    const isAuthor = post.author === currentUserId;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <small>Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
            
            <div 
                className="post-content" 
                dangerouslySetInnerHTML={createMarkup(post.content)}
            ></div>
            
            {isAuthor && (
                <div className="author-actions">
                    <Link to={`/edit-post/${post._id}`} className="edit-button">Edit</Link>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            )}
        </div>
    );
};

export default PostDetailPage;