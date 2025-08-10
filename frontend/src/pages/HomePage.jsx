import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../App.css'; // For post list styles

const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get('/api/posts');
                setPosts(response.data);
            } catch (err) {
                setError('Failed to fetch posts.' , err.response);
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