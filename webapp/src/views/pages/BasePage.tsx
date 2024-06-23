import { Box } from '@mui/material';
import Footer from '../components/footer/Footer';
import Header from '../components/header/Header';


//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme: any, children: any }) => {


  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header toggleTheme={props.toggleTheme} />
      <Box component="main" flexGrow={1} mt={2} mb={2}>
        {/* Aquí va el contenido principal de la página */}
        {props.children}
      </Box>
      <Footer />
    </Box>
  );
}
//#endregion
export default BasePage;
