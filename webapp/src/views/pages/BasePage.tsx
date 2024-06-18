import Header from '../components/header/Header';
import Container from '../components/container/Container';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';


//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme: any, children: any }) => {

  return (
    <Container disableGutters style={{ height: '100vh' }}>
      <Header toggleTheme={props.toggleTheme} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Container>
          {props.children}
        </Container>
      </Box>
    </Container>
  );
}
//#endregion
export default BasePage;
