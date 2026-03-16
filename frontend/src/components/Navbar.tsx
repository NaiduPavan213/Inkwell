import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className='navbar'>
            <Link to="/" className='navbar-brand'>InkWell</Link>
            <div className='navbar-links'>
                {auth?.token ? (
                    <>
                        <Link to='/create-post'>Create Post</Link>
                        <button onClick={handleLogout} className='logout-button'>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    );
};

export default Navbar;
