import React, { useState, useEffect, useContext } from 'react';
// ... (other imports remain the same)
import Comments from '../components/Comments'; // Import Comments component
import LikeButton from '../components/LikeButton'; // Import LikeButton component

const PostDetailPage = () => {
    // ... (all existing state and logic remains the same)

    if (loading) return <p>Loading...</p>;
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

            {/* Add the new components here */}
            <LikeButton postId={id} />
            <Comments postId={id} />
        </div>
    );
};

export default PostDetailPage;