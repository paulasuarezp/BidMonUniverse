import { useState } from 'react'
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, darkTheme } from './themes';
import  Button  from './views/components/button/Button';
import LogoBox  from './views/components/logoBox/LogoBox';
import './App.css'
import Paper from './views/components/paper/Paper';

function App() {
  const [mode, setMode] = useState('light');

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={mode === 'light' ? lightTheme : darkTheme}>
      <Paper background={'light'}>
        <LogoBox />
        <Button label="Primer botón" />
        <Button label="Segundo botón" buttonType='secondary'/>
      </Paper>
    </ThemeProvider>
  )
}

export default App
