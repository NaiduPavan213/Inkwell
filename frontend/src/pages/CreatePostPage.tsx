import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '../App.css';

const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File | null>(null);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            if (image) {
                formData.append('image', image);
            }

            const config = {
                headers: { 
                    'x-auth-token': auth?.token,
                    'Content-Type': 'multipart/form-data'
                },
            };
            await axios.post('/api/posts', formData, config);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to create post.');
        } finally {
            setLoading(false);
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
                    <label htmlFor="image">Cover Image (Optional)</label>
                    <div className="file-upload-wrapper">
                        <label htmlFor="image" className="file-upload-label">
                            {image ? 'Change Image' : 'Choose Cover Image'}
                        </label>
                        <input 
                            type="file" 
                            id="image" 
                            accept="image/*" 
                            className="file-upload-input"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)} 
                        />
                        {image && <span className="file-name">{image.name}</span>}
                    </div>
                </div>
                <div className="form-group no-margin">
                    <label>Content</label>
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent} 
                        className="quill-editor"
                    />
                </div>
                <button 
                    type="submit" 
                    className="form-button" 
                    style={{ float: 'right', marginTop: '10px' }} 
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Post'}
                </button>
                <div style={{ clear: 'both' }}></div>
            </form>
        </div>
    );
};

export default CreatePostPage;
