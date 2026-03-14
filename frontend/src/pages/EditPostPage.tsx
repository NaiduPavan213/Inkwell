import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../App.css';

interface Post {
    title: string;
    content: string;
}

const EditPostPage: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [error, setError] = useState<string>('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get<Post>(`/api/posts/${id}`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {
                setError('Could not load the post for editing.');
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const config = { headers: { 'x-auth-token': auth?.token } };
            await axios.put(`/api/posts/${id}`, { title, content }, config);
            navigate(`/posts/${id}`);
        } catch (err) {
            setError('Failed to update post.');
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
                    <label>Content</label>
                    <ReactQuill 
                        theme="snow" 
                        value={content} 
                        onChange={setContent}
                        className="quill-editor"
                    />
                </div>
                <button type="submit" className="form-button">Update Post</button>
            </form>
        </div>
    );
};

export default EditPostPage;
