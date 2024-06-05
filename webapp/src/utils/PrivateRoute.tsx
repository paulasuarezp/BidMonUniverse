import { ReactNode } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { getCurrentUser } from '../api/userAPI';

//#region PROPS
interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
    element: ReactNode;
}
//#endregion

//#region COMPONENT PrivateRoute
export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const sessionUser = getCurrentUser();

    return (
        sessionUser ? element : <Navigate to="/login" replace />
    );
}
//#endregion
