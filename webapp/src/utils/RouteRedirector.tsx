import { ReactElement } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { AccessLevel } from '../shared/sharedTypes';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

//#region PROPS
interface RouteRedirectorProps extends Omit<RouteProps, 'element'> {
    initRoute: ReactElement; // Ruta elegida por el usuario
    redirectPath: string; // Ruta de redirección
    accessLevel: AccessLevel; // Criterio para elegir la ruta
}
//#endregion

//#region COMPONENT PrivateRoute
export const RouteRedirector = ({ initRoute, redirectPath, accessLevel }: RouteRedirectorProps) => {
    const token = localStorage.getItem('userToken');
    if(!token)
        return <Navigate to="/login" replace />
    else {
        console.log('Token encontrado:', token);

        const sessionUser = useSelector((state: RootState) => state.user);

        if(accessLevel === AccessLevel.Guest && sessionUser) // Por ejemplo, si un usuario ya ha iniciado sesión e intenta volver a iniciarla, redirigirlo a la página de inicio
            return  <Navigate to={redirectPath} replace />
        
        if(accessLevel === AccessLevel.Standard && !sessionUser && redirectPath) // Si un usuario no ha iniciado sesión y necesita hacerlo, redirigirlo a la página de inicio de sesión
            return <Navigate to={redirectPath} replace />
        
        if(accessLevel === AccessLevel.Admin && (!sessionUser || sessionUser.role !== AccessLevel.Admin)) // Si un usuario no ha iniciado sesión o no es administrador, redirigirlo a la página de inicio
            return sessionUser ? <Navigate to={redirectPath} replace /> : <Navigate to="/login" replace />

    }

    
    return initRoute;
}
//#endregion
