import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // We need a library to decode the token

const PostDetailPage = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // Get the current user's ID from the token, if it exists
    const currentUserId = token ? jwtDecode(token).user.id : null;

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err) {
                setError('Post not found.' , err.response);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const config = {
                    headers: { 'x-auth-token': token },
                };
                await axios.delete(`/api/posts/${id}`, config);
                navigate('/'); // Redirect to homepage after deletion
            } catch (err) {
                alert('Failed to delete post. You might not be the author.' , err.response);
            }
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="error-msg">{error}</p>;

    // Check if the logged-in user is the author of the post
    const isAuthor = post && post.author === currentUserId;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <div className="post-content" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
            <small>Posted on: {new Date(post.createdAt).toLocaleDateString()}</small>
            
            {/* Only show Edit and Delete buttons if the user is the author */}
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