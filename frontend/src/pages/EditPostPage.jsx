import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../App.css';

const EditPostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams(); // Get the post ID from the URL

    // Effect to fetch the post data when the component loads
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`/api/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {
                setError('Could not load the post for editing.' , err.response);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'x-auth-token': token,
                },
            };
            // Send a PUT request to update the post
            await axios.put(`/api/posts/${id}`, { title, content }, config);
            navigate(`/posts/${id}`); // Navigate back to the post detail page
        } catch (err) {
            setError('Failed to update post. You might not be the author.' , err.response);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Edit Post</h2>
                {error && <p className="error-msg">{error}</p>}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        rows="10"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="form-button">Update Post</button>
            </form>
        </div>
    );
};

export default EditPostPage;