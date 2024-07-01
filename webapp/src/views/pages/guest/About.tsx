import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import { Avatar, Box, Card, CardContent, Grid, IconButton, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import Container from '../../components/container/Container';
import PokeballsBox from '../../components/ornament/PokeballsBox';

const StyledBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    marginBottom: theme.spacing(4),
    flexDirection: 'column',
}));

const InfoCard = styled(Card)(({ theme }) => ({
    margin: theme.spacing(2, 0),
    borderRadius: 15,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(2),
    },
}));

const CardAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(14),
    height: theme.spacing(14),
    margin: '0 auto -70px',
    zIndex: 1,
    border: `4px solid ${theme.palette.background.paper}`,
}));

const CircularIconButton = styled(IconButton)(({ theme }) => ({
    minWidth: theme.spacing(7),
    minHeight: theme.spacing(7),
    borderRadius: '50%',
    backgroundColor: '#900506',
    color: 'white',
    margin: theme.spacing(1),
    '&:hover': {
        transform: 'scale(1.1)',
        backgroundColor: '#900506',
    },
    '&:focus': {
        outline: '2px solid',
        outlineColor: theme.palette.primary.main,
    },
}));

const ContactSection = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
}));

const ContactLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.text.primary,
    textDecoration: 'none',
    marginTop: theme.spacing(1),
    '&:hover': {
        textDecoration: 'underline',
    },
    '&:focus': {
        outline: '2px solid',
        outlineColor: theme.palette.primary.main,
    },
}));

const About = () => {
    const theme = useTheme();

    return (
        <Container>
            <StyledBox>
                <PokeballsBox titulo="Sobre nosotros" />
                <Typography variant="h2" sx={{ mt: 4, mb: 2 }}>
                    En esta página encontrarás información sobre los autores de este proyecto.
                </Typography>
            </StyledBox>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'relative' }} component={'section'} aria-labelledby="school-title">
                        <CardAvatar alt="Universidad" src="/eii_logo.png" />
                        <InfoCard sx={{ pt: 8 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography id="school-title" variant="h2" component="h2">
                                    Escuela de Ingeniería Informática
                                </Typography>
                                <Typography variant="h3" component="h3">
                                    Universidad de Oviedo
                                </Typography>
                                <Typography sx={{ mt: 2, textAlign: 'left' }}>
                                    La Escuela de Ingeniería Informática es una escuela de ingeniería especializada en el campo de la Ingeniería Informática perteneciente a la Universidad de Oviedo.
                                    <br />
                                    La plataforma BidMon Universe ha sido desarrollada como Trabajo de Fin de Grado de la titulación de Ingeniería Informática del Software.
                                </Typography>

                                <ContactSection>
                                    <Typography component="div" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                                        Información de contacto:
                                    </Typography>
                                    <Typography sx={{ mt: 2, textAlign: 'left' }}>
                                        <PlaceIcon sx={{ mr: 1 }} />
                                        Campus de Los Catalanes,
                                        C/ Valdés Salas, 33007 Oviedo
                                    </Typography>
                                    <ContactLink href="tel:+34985102796" aria-label="Llamar al teléfono +34 985 10 27 96">
                                        <PhoneIcon sx={{ mr: 1 }} />
                                        (+34) 985 10 27 96
                                    </ContactLink>
                                    <ContactLink href="mailto:eii@uniovi.es" aria-label="Enviar correo a eii@uniovi.es">
                                        <MailOutlineIcon sx={{ mr: 1 }} />
                                        eii@uniovi.es
                                    </ContactLink>
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Link href="https://ingenieriainformatica.uniovi.es/" target="_blank" sx={{ display: 'inline-block' }} aria-label="Página web de la Escuela de Ingeniería Informática">
                                            <CircularIconButton>
                                                <LanguageIcon />
                                            </CircularIconButton>
                                        </Link>
                                    </Box>
                                </ContactSection>
                            </CardContent>
                        </InfoCard>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'relative' }} component={'section'} aria-labelledby="paula-title">
                        <CardAvatar alt="Foto de Paula Suárez Prieto" src="/paula.jpeg" />
                        <InfoCard sx={{ pt: 8 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography id="paula-title" variant="h2" component="h2">
                                    Paula Suárez Prieto
                                </Typography>
                                <Typography variant="h3" component="h3">
                                    Equipo de desarrollo
                                </Typography>
                                <Typography sx={{ mt: 2, textAlign: 'left' }}>
                                    Estudiante de último curso de Ingeniería Informática del Software en la Escuela de Ingeniería Informática.
                                    Ha desarrollado BidMon Universe como Trabajo de Fin de Grado.
                                </Typography>
                                <ContactSection>
                                    <Typography component="div" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                                        Información de contacto:
                                    </Typography>
                                    <ContactLink href="mailto:uo269745@uniovi.es" aria-label="Enviar correo a uo269745@uniovi.es">
                                        <MailOutlineIcon sx={{ mr: 1 }} />
                                        uo269745@uniovi.es
                                    </ContactLink>
                                    <ContactLink href="mailto:paulasp24@icloud.com" aria-label="Enviar correo a paulasp24@icloud.com">
                                        <MailOutlineIcon sx={{ mr: 1 }} />
                                        paulasp24@icloud.com
                                    </ContactLink>
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Link href="https://github.com/paulasuarezp" target="_blank" sx={{ display: 'inline-block' }} aria-label="Perfil de GitHub de Paula Suárez Prieto">
                                            <CircularIconButton>
                                                <GitHubIcon />
                                            </CircularIconButton>
                                        </Link>
                                        <Link href="https://www.linkedin.com/in/paula-suárez-prieto?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" sx={{ display: 'inline-block' }} aria-label="Perfil de LinkedIn de Paula Suárez Prieto">
                                            <CircularIconButton>
                                                <LinkedInIcon />
                                            </CircularIconButton>
                                        </Link>
                                    </Box>
                                </ContactSection>
                            </CardContent>
                        </InfoCard>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ position: 'relative' }} component={'section'} aria-labelledby="hugo-title">
                        <CardAvatar alt="Hugo Lebredo Buján" src="" />
                        <InfoCard sx={{ pt: 8 }}>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Typography id="hugo-title" variant="h2" component="h2">
                                    Hugo Lebredo Buján
                                </Typography>
                                <Typography variant="h3" component="h3">
                                    Tutor del TFG
                                </Typography>
                                <Typography sx={{ mt: 2, textAlign: 'left' }}>
                                    Profesor del Departamento de Informática de la Universidad de Oviedo encargado de la tutorización del Trabajo de Fin de Grado.
                                </Typography>
                                <ContactSection>
                                    <Typography component="div" sx={{ textAlign: 'left', fontWeight: 'bold' }}>
                                        Información de contacto:
                                    </Typography>
                                    <ContactLink href="mailto:lebredohugo@uniovi.es" aria-label="Enviar correo a lebredohugo@uniovi.es">
                                        <MailOutlineIcon sx={{ mr: 1 }} />
                                        lebredohugo@uniovi.es
                                    </ContactLink>
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Link href="https://github.com/HugoLebredo" target="_blank" sx={{ display: 'inline-block' }} aria-label="Perfil de GitHub de Hugo Lebredo Buján">
                                            <CircularIconButton>
                                                <GitHubIcon />
                                            </CircularIconButton>
                                        </Link>
                                        <Link href="https://www.di.uniovi.es/personal/pdi/-/asset_publisher/0028/content/pdi_lebredo-bujan-hugo;jsessionid=95871949D3211A74D3619EA585B34539?redirect=%2Fpersonal%2Fpdi" target="_blank" sx={{ display: 'inline-block' }} aria-label="Página personal de Hugo Lebredo Buján en la Universidad de Oviedo">
                                            <CircularIconButton>
                                                <LanguageIcon />
                                            </CircularIconButton>
                                        </Link>
                                    </Box>
                                </ContactSection>
                            </CardContent>
                        </InfoCard>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default About;
