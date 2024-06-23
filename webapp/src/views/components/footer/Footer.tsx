import EmailIcon from '@mui/icons-material/Email';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import { AppBar, Box, IconButton, Link, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

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
        alignItems: 'flex-start',
    },
}));

const FooterSection = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
}));

const FooterLink = styled(Link)(({ theme }) => ({
    color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.text.secondary,
    textDecoration: 'none',
    '&:hover': {
        textDecoration: 'underline',
    },
}));

const SocialMediaIcons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    '& a': {
        color: theme.palette.mode === 'light' ? theme.palette.text.primary : theme.palette.text.secondary,
    },
}));
//#endregion

//#region COMPONENTE FOOTER
export default function Footer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <StyledFooter position="relative">
            <Toolbar>
                <FooterContainer>
                    <FooterSection>
                        <Typography variant="h6" gutterBottom>
                            Secciones
                        </Typography>
                        <FooterLink href="#inicio">Inicio</FooterLink>
                        <FooterLink href="#acerca-de">Acerca de</FooterLink>
                    </FooterSection>
                    <FooterSection>
                        <Typography variant="h6" gutterBottom>
                            Contacto
                        </Typography>
                        <FooterLink href="mailto:contacto@bidmon.com">
                            <EmailIcon fontSize="small" /> contacto@bidmon.com
                        </FooterLink>
                        <FooterLink href="tel:+1234567890">
                            <PhoneIcon fontSize="small" /> +1 234 567 890
                        </FooterLink>
                    </FooterSection>
                    <FooterSection>
                        <Typography variant="h6" gutterBottom>
                            Síguenos
                        </Typography>
                        <SocialMediaIcons>
                            <Link href="https://www.facebook.com" target="_blank">
                                <IconButton>
                                    <FacebookIcon />
                                </IconButton>
                            </Link>
                            <Link href="https://www.twitter.com" target="_blank">
                                <IconButton>
                                    <TwitterIcon />
                                </IconButton>
                            </Link>
                            <Link href="https://www.instagram.com" target="_blank">
                                <IconButton>
                                    <InstagramIcon />
                                </IconButton>
                            </Link>
                        </SocialMediaIcons>
                    </FooterSection>
                </FooterContainer>
                <Box mt={isMobile ? 2 : 0} textAlign="center" width="100%">
                    <Typography variant="body2" color="textSecondary">
                        &copy; 2024 BidMon Universe. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Toolbar>
        </StyledFooter>
    );
}
//#endregion
