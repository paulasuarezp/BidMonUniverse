import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { AppBar, Box, IconButton, Link, Toolbar, Typography, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

//#region STYLES
const StyledFooter = styled(AppBar)(({ theme }) => ({
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.mode === 'light' ? '#c92918' : theme.palette.background.default,
    boxShadow: 'none',
    borderRadius: '6em 6em 0 0',
    padding: theme.spacing(2),
    position: 'relative',
}));

const FooterContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const FooterSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    alignItems: 'center',
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: '#FFFFFF',
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
        color: '#FFFFFF',
        transform: 'scale(1.1)',
    },
}));

const SocialMediaIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',

}));
//#endregion

//#region COMPONENTE FOOTER
export default function Footer() {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleAboutClick = () => {
        navigate('/about');
    };

    const handleHomeClick = () => {
        navigate('/');
    };


    return (
        <StyledFooter position="relative">
            <Toolbar>
                <FooterContainer>
                    <FooterSection>
                        <FooterLink
                            role="button"
                            onClick={handleHomeClick}
                            aria-label="Ir a la página de inicio"
                        >
                            Inicio
                        </FooterLink>
                        <FooterLink
                            role="button"
                            onClick={handleAboutClick}
                            aria-label="Ir a la página de acerca de"
                        >
                            Acerca de
                        </FooterLink>
                    </FooterSection>
                    <FooterSection>
                        <Typography gutterBottom>
                            Contacto
                        </Typography>
                        <FooterLink href="mailto:uo269745@uniovi.es" aria-label="Enviar un correo electrónico">
                            <EmailIcon fontSize="small" /> uo269745@uniovi.es
                        </FooterLink>
                    </FooterSection>
                    <FooterSection>
                        <Typography gutterBottom>
                            Síguenos
                        </Typography>
                        <SocialMediaIcons>
                            <Link href="https://www.linkedin.com/in/paula-suárez-prieto?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" aria-label="Enlace a LinkedIn">
                                <IconButton sx={{ color: '#FFFFFF' }} aria-label='LinkedIn'>
                                    <LinkedInIcon />
                                </IconButton>
                            </Link>
                            <Link href="https://github.com/paulasuarezp" target="_blank" aria-label="Enlace a GitHub">
                                <IconButton sx={{ color: '#FFFFFF' }} aria-label='GitHub'>
                                    <GitHubIcon />
                                </IconButton>
                            </Link>
                        </SocialMediaIcons>
                    </FooterSection>
                </FooterContainer>

                <Box mt={2} textAlign="center" width="100%">
                    <Typography variant="body2" color="textSecondary" sx={{ color: '#FFFFFF' }}>
                        &copy; 2024 BidMon Universe. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Toolbar>
        </StyledFooter>
    );
}
//#endregion