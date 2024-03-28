import { ReactNode } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ajusta la importación según tu estructura de directorios

//#region PROPS
interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
    element: ReactNode;
}
//#endregion

//#region COMPONENT PrivateRoute
export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const { sessionUser } = useAuth();

    return (
        sessionUser ? element : <Navigate to="/login" replace />
    );
}
//#endregion
