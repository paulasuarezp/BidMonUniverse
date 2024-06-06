import Header from '../components/header/Header';
import Container from '../components/container/Container';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';

// Hook para obtener el tamaño de la ventana
function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
  
    useEffect(() => {
      const updateSize = () => {
        setSize([window.innerWidth, window.innerHeight]);
      };
      window.addEventListener('resize', updateSize);
      updateSize(); 
  
      return () => window.removeEventListener('resize', updateSize); 
    }, []);
  
    return size;
  }

//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme:any, children: any }) => {
    const [width] = useWindowSize();
    const isLaptop = width<=1536 && width>1024;
    
    
    return (
        <Container disableGutters >
            <Header toggleTheme={props.toggleTheme}/>
            <Box sx={{mt: isLaptop? '3.5em' : 0}}>
            <Container>
                {props.children}
            </Container>
            </Box>
        </Container>
    );
}
//#endregion
export default BasePage;
