import { createContext, useContext, useState, ReactNode } from 'react';
import { SessionUser } from '../shared/sharedTypes';
import { verifyToken } from '../api/userAPI';


//#region PROPS
interface AuthProviderProps {
  children: ReactNode;
}
//#endregion

//#region TYPE AuthContextType
interface AuthContextType {
  sessionUser: SessionUser | undefined;
  login: (user: SessionUser) => void;
  logout: () => void;
}
//#endregion


const AuthContext = createContext<AuthContextType | undefined>(undefined);

//#region COMPONENT AuthProvider
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [sessionUser, setSessionUser] = useState<SessionUser | undefined>(undefined);


    const login = async (user: any)  => {
      await verifyToken()
        .then(response => {
          console.log("Respuesta de verifyToken en AuthContext:", response);
          setSessionUser(user);
        })
        .catch(error => {
          console.error("Error en verifyToken en AuthContext:", error);
          setSessionUser(undefined);
        });
    };

    const logout = () => {
      localStorage.removeItem('userToken');
      setSessionUser(undefined);
    };
  
    return (
      <AuthContext.Provider value={{ sessionUser, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
//#endregion

//#region HOOK useAuth
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
  };
//#endregion
  
