import React from 'react';
import { ThemeProvider } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/pages/Home';
import BasePage from './views/pages/BasePage';
import NotFoundPage from './views/pages/NotFoundPage';
import Login from './views/layouts/Login';
import Logueado from './views/pages/Logueado';
import { AuthProvider } from './utils/AuthContext';
import { PrivateRoute } from './utils/PrivateRoute';

function App() {
  const [mode, setMode] = React.useState('light'); // Tema claro por defecto
  

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };


  return (
    <AuthProvider>
      <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
        <CssBaseline />
        <Router>
          <BasePage toggleTheme={toggleMode} >
            <>
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                {/* Rutas protegidas */}
                <Route path="/logueado" element={<PrivateRoute element={<Logueado/>}/>}/>
                {/* Página de Error */}
                <Route path="*" element={<NotFoundPage/>}/>
              </Routes>
            </>
          </BasePage>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
