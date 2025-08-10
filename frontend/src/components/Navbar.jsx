import {useContext} from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { token , logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirect to login page after logout
    };

    return (
        <nav className='navbar'>
            <Link to="/" className='navbar-brand'>InkWell</Link>
            <div className='navbar-links'>
                { token ? (
                    <>
                        <Link to='/create-post'>Create Post</Link>
                        <button onClick = {handleLogout} className='logout-button'>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;