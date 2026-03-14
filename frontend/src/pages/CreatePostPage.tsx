import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css';

const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = {
                headers: { 'x-auth-token': auth?.token },
            };
            await axios.post('/api/posts', { title, content }, config);
            navigate('/');
        } catch (err: any) {
            setError('Failed to create post.');
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
