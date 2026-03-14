import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Lazy load components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CreatePostPage = lazy(() => import('./pages/CreatePostPage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const EditPostPage = lazy(() => import('./pages/EditPostPage'));

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Suspense fallback={
          <div className="loading-spinner" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            fontSize: '1.2rem',
            color: '#666'
          }}>
            Loading...
          </div>
        }>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            
            {/* Protected Routes (for logged-in users) */}
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-post/:id" 
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

export default App;