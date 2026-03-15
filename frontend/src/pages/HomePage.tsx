import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css';

interface Post {
    _id: string;
    title: string;
    content: string;
    createdAt: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>('/api/posts');
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error('API did not return an array:', response.data);
                    setError('Received invalid data from server.');
                }
            } catch (err: any) {
                setError('Failed to fetch posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p className="error-msg">{error}</p>;

    return (
        <div>
            <h1>All Posts</h1>
            <div className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <div key={post._id} className="post-item">
                            <h2>{post.title}</h2>
                            <p>{post.content.substring(0, 150)}...</p>
                            <Link to={`/posts/${post._id}`} className="read-more-link">Read More</Link>
                        </div>
                    ))
                ) : (
                    <p>No posts found. Why not create one?</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
