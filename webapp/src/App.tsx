import React from 'react';
import { ThemeProvider } from '@mui/system';
import { lightTheme, darkTheme } from './themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BasePage from './views/pages/BasePage';
import Login from './views/layouts/Login';
import Home from './views/pages/Home';

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
            </Routes>
          </>
        </BasePage>
      </Router>
    </ThemeProvider>
  );
}

export default App;
