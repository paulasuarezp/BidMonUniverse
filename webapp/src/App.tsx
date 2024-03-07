import React from 'react';
import { ThemeProvider } from '@mui/system';
import { lightTheme, darkTheme } from './themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './views/pages/Home';
import BasePage from './views/pages/BasePage';
import NotFoundPage from './views/pages/NotFoundPage';
import Login from './views/layouts/Login';

function App() {
  const [mode, setMode] = React.useState('light');
  

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };


  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <Router>
        <BasePage toggleTheme={toggleMode} >
          <>
            <Routes>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="*" element={<NotFoundPage/>}/>
            </Routes>
          </>
        </BasePage>
      </Router>
    </ThemeProvider>
  );
}

export default App;
