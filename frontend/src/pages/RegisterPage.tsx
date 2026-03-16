import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import '../App.css';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post<{ token: string }>('/api/auth/register', { username, email, password });
            auth?.login(response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.msg || 'Failed to register. Please try again.');
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
            setError('Google registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-tabs">
                    <Link to="/login" className="auth-tab">Sign In</Link>
                    <div className="auth-tab active">Sign Up</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', width: '100%' }}>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Signup Failed')}
                            text="signup_with"
                            width="340"
                            theme="outline"
                            shape="rectangular"
                        />
                    </div>
                </div>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="auth-label" htmlFor="username">Username</label>
                        <input
                            className="auth-input"
                            type="text"
                            id="username"
                            placeholder="Your name"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input
                            className="auth-input"
                            type="email"
                            id="email"
                            placeholder="name@example.com"
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
                    <button type="submit" className="auth-submit-btn">Create Account</button>
                </form>

                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
