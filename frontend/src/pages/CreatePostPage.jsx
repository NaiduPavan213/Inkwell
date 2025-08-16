// frontend/src/pages/CreatePostPage.jsx
// This is the UPDATED CreatePostPage to include the rich text editor.

import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import '../App.css';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // The content will now be HTML
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'x-auth-token': token },
            };
            await axios.post('/api/posts', { title, content }, config);
            navigate('/');
        } catch (err) {
            setError('Failed to create post.',err.response);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h2>Create New Post</h2>
                {error && <p className="error-msg">{error}</p>}
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Content</label>
                    {/* Replace textarea with ReactQuill component */}
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent} 
                        className="quill-editor"
                    />
                </div>
                <button type="submit" className="form-button">Create Post</button>
            </form>
        </div>
    );
};

export default CreatePostPage;
