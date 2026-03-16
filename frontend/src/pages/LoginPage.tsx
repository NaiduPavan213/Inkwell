import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../App.css';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post<{ token: string }>('/api/auth/login', { email, password });
            auth?.login(response.data.token);
            navigate('/');
        } catch (err: any) {
            const serverMsg = err.response?.data?.msg;
            if (serverMsg === 'Incorrect password.') {
                setError('Incorrect password, try again later');
            } else {
                setError('Login failed. Please check your credentials.');
            }
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const response = await axios.post<{ token: string }>('/api/auth/google', {
                tokenId: credentialResponse.credential
            });
            auth?.login(response.data.token);
            navigate('/');
        } catch (err: any) {
            setError('Google login failed. Please try again.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-tabs">
                    <div className="auth-tab active">Sign In</div>
                    <Link to="/register" className="auth-tab">Sign Up</Link>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Login Failed')}
                        text="continue_with"
                        width="280"
                        theme="outline"
                        shape="rectangular"
                    />
                </div>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            className="auth-input"
                            type="password"
                            id="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Sign In</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#71717a', textDecoration: 'none' }}>
                        Forgot password?
                    </Link>
                </div>

                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
