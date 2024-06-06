import { ReactNode } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';


//#region PROPS
interface PrivateRouteProps extends Omit<RouteProps, 'element'> {
    element: ReactNode;
}
//#endregion

//#region COMPONENT PrivateRoute
export const PrivateRoute = ({ element }: PrivateRouteProps) => {
    const sessionUser = useSelector((state: RootState) => state.user);
    let isUserLogged = sessionUser.username ? true : false;
    
    return (
        isUserLogged ? element : <Navigate to="/login" replace />
    );
}
//#endregion
