import React from 'react';
import { ThemeProvider } from '@mui/system';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/pages/Home';
import BasePage from './views/pages/BasePage';
import NotFoundPage from './views/pages/NotFoundPage';
import Login from './views/layouts/Login';
import Signup from './views/layouts/Signup';
import Logueado from './views/pages/Logueado';
import { RouteRedirector } from './utils/RouteRedirector';
import { AccessLevel } from './shared/sharedTypes';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import MyCollection from './views/pages/MyCollection';

function App() {
  const [mode, setMode] = React.useState('light'); // Tema claro por defecto


  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };


  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          <Router>
            <BasePage toggleTheme={toggleMode} >
              <>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<RouteRedirector initRoute={<Login />} redirectPath="/logued" accessLevel={AccessLevel.Guest} />} />
                  <Route path="/signup" element={<RouteRedirector initRoute={<Signup />} redirectPath="/login" accessLevel={AccessLevel.Guest} />} />
                  {/* Rutas protegidas */}
                  <Route path="/logued" element={<RouteRedirector initRoute={<Logueado />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  <Route path="/album" element={<RouteRedirector initRoute={<MyCollection />} redirectPath="/login" accessLevel={AccessLevel.Standard} />} />
                  {/* Página de Error */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </>
            </BasePage>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
