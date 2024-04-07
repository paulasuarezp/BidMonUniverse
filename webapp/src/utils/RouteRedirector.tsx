import { ReactNode } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ajusta la importación según tu estructura de directorios
import { AccessLevel } from '../shared/sharedTypes';


//#region PROPS
interface RouteRedirectorProps extends Omit<RouteProps, 'element'> {
    initRoute: ReactNode; // Ruta elegida por el usuario
    redirectPath: string; // Ruta de redirección
    accessLevel: AccessLevel; // Criterio para elegir la ruta
}
//#endregion

//#region COMPONENT PrivateRoute
export const RouteRedirector = ({ initRoute, redirectPath, accessLevel }: RouteRedirectorProps) => {
    const { sessionUser } = useAuth();

    if(accessLevel === AccessLevel.Guest && sessionUser) // Por ejemplo, si un usuario ya ha iniciado sesión e intenta volver a iniciarla, redirigirlo a la página de inicio
        return  <Navigate to={redirectPath} replace />
    
    if(accessLevel === AccessLevel.User && !sessionUser && redirectPath) // Si un usuario no ha iniciado sesión y necesita hacerlo, redirigirlo a la página de inicio de sesión
        return <Navigate to={redirectPath} replace />
    
    if(accessLevel === AccessLevel.Admin && (!sessionUser || sessionUser.role !== AccessLevel.Admin)) // Si un usuario no ha iniciado sesión o no es administrador, redirigirlo a la página de inicio
        return sessionUser ? <Navigate to={redirectPath} replace /> : <Navigate to="/login" replace />

    return initRoute;
}
//#endregion
