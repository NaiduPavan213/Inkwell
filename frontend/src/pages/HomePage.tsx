import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { GlassBlogCard } from '../components/ui/glass-blog-card-shadcnui';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
        avatar?: string;
    };
    coverImage?: string;
    createdAt: string;
}

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get<Post[]>('/api/posts');
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
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

    const stripHtml = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const calculateReadTime = (text: string) => {
        const words = text.split(/\s+/).length;
        return `${Math.ceil(words / 200)} min read`;
    };

    if (loading) return <p style={{ textAlign: 'center', padding: '50px' }}>Loading posts...</p>;
    if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '1200px', margin: '-30px auto 0', padding: '0 20px 60px 20px' }}>
            <h1 style={{ textAlign: 'center', fontSize: '3.5rem', marginBottom: '30px', fontFamily: "'Playfair Display', serif" }}>
                Latest Stories
            </h1>
            
            {/* 3 COLUMN GRID - FORCED */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '40px',
                justifyItems: 'center'
            }}>
                {posts.length > 0 ? (
                    posts.map(post => (
                        <GlassBlogCard 
                            key={post._id}
                            title={post.title}
                            excerpt={stripHtml(post.content).substring(0, 100) + '...'}
                            image={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80'}
                            author={{
                                name: post.author?.username || "InkWell Author",
                                avatar: post.author?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?._id || post._id}`
                            }}
                            date={new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            readTime={calculateReadTime(post.content)}
                            tags={["Blog", "InkWell"]}
                            onClick={() => navigate(`/posts/${post._id}`)}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                        <p>No posts found. <Link to="/create-post" style={{ color: 'blue' }}>Start Writing →</Link></p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
