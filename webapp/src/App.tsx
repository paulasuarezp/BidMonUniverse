import React from 'react';
import { ThemeProvider } from '@mui/system';
import { lightTheme, darkTheme } from './themes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BasePage from './views/pages/BasePage';
import Login from './views/layouts/Login';
import Button from './views/components/button/Button';

function App() {
  const [mode, setMode] = React.useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <Router>
          <Routes>
          <Route path="/" element={
              <BasePage toggleTheme={toggleMode} children={<Login/>}/>
            } 
          />
          </Routes>
        </Router>
    </ThemeProvider>
  );
}

export default App;
