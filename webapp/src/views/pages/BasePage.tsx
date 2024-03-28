import Header from '../components/header/Header';
import Container from '../components/container/Container';

//#region COMPONENT BasePage
export const BasePage = (props: { toggleTheme:any, children: any }) => {
    return (
        <Container disableGutters >
            <Header toggleTheme={props.toggleTheme}/>
            {props.children}
        </Container>
    );
}
//#endregion
export default BasePage;
