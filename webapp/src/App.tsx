import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';
import Login from './views/layouts/Login';

function App() {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <Login></Login>
    </ThemeProvider>
  )
}

export default App
