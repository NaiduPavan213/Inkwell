import React, { useContext, ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useContext(AuthContext);
    const location = useLocation();

    if (!auth?.token) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them back to that page after they log in.
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
