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

function App() {
  const [mode, setMode] = React.useState('light');
  

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
                <Route path="/logueado" element={<Logueado/>}/>
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
