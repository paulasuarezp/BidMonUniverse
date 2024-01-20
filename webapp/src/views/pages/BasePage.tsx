import React from 'react';
import Header from '../components/header/Header';
import Container from '../components/container/Container';

interface BasePageProps {
    toggleTheme: () => void;
    children: React.ReactNode;
}
export const BasePage = (props: { toggleTheme:any, children: any }) => {
    return (
        <Container disableGutters maxWidth={false}>
            <Header toggleTheme={props.toggleTheme}/>
            {props.children}
        </Container>
    );
}

export default BasePage;
