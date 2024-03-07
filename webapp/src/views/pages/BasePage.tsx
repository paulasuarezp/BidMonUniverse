import React from 'react';
import Header from '../components/header/Header';
import Container from '../components/container/Container';

export const BasePage = (props: { toggleTheme:any, children: any }) => {
    return (
        <Container disableGutters >
            <Header toggleTheme={props.toggleTheme}/>
            {props.children}
        </Container>
    );
}

export default BasePage;
