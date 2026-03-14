import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import DOMPurify from 'dompurify';
import Comments from '../components/Comments';
import LikeButton from '../components/LikeButton';
import '../App.css';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

interface DecodedToken {
    user: {
        id: string;
    };
}

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const currentUserId = auth?.token ? (jwtDecode(auth.token) as DecodedToken).user.id : null;

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await axios.get<Post>(`/api/posts/${id}`);
                setPost(response.data);
            } catch (err: any) {
                setError('Post not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const createMarkup = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const config = { headers: { 'x-auth-token': auth?.token } };
                await axios.delete(`/api/posts/${id}`, config);
                navigate('/');
            } catch (err: any) {
                alert('Failed to delete post. You might not be the author.');
            }
        }
    };

    if (loading) return <p>Loading post...</p>;
    if (error) return <p className="error-msg">{error}</p>;
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

            <hr className="divider" />

            <LikeButton postId={id || ''} />
            <Comments postId={id || ''} />
        </div>
    );
};

export default PostDetailPage;
