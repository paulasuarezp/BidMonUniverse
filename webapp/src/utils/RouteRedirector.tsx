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
    const sessionUser = useSelector((state: RootState) => state.user);
    let isAuth = sessionUser?.username ? true : false;

    console.log(sessionUser.username)
    console.log(isAuth)
   
    if(accessLevel === AccessLevel.Guest && isAuth) // Por ejemplo, si un usuario ya ha iniciado sesión e intenta volver a iniciarla, redirigirlo a la página de inicio
        return  <Navigate to={redirectPath} replace />
    
    if(accessLevel === AccessLevel.Standard && !isAuth && redirectPath) // Si un usuario no ha iniciado sesión y necesita hacerlo, redirigirlo a la página de inicio de sesión
        return <Navigate to={redirectPath} replace />
    
    if(accessLevel === AccessLevel.Admin && (!isAuth || sessionUser.role !== AccessLevel.Admin)) // Si un usuario no ha iniciado sesión o no es administrador, redirigirlo a la página de inicio
        return sessionUser ? <Navigate to={redirectPath} replace /> : <Navigate to="/login" replace />

    

    
    return initRoute;
}
//#endregion
