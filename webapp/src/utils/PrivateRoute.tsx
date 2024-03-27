import React, { ReactNode } from 'react';
import { Route, Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ajusta la importación según tu estructura de directorios

interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
    element: ReactNode;
}

export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { sessionUser } = useAuth();

    return (
        <Route
            element={sessionUser ? element : <Navigate to="/login" replace />}
        />
    );
}
