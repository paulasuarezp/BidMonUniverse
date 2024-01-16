import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';


const StyledBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    height: '20%',
    width: 'auto',
})


export default function LogoBox() {

    return (
        
        <StyledBox>
            <img src="logo.png" alt="Logo Pokemon" />
        </StyledBox>
                    
    );
}