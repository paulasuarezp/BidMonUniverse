import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const MyContainer = styled(Container)({
    backgroundImage: 'url("../background.png")',
    display: 'flex',
})


export default function MiContainer() {

    return (
        <MyContainer>
        </MyContainer>
    );
}