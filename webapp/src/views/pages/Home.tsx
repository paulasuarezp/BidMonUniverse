import { Box, Dialog, DialogContent, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/system';
import { useState } from "react";
import Slider from "react-slick";
import { getPopularCards } from '../../utils/cardData';
import ButtonPrincipal from '../components/buttons/principal/ButtonPrincipal';
import PokemonCard from '../components/card/PokemonCard';
import Container from '../components/container/Container';
import PokeballsBox from '../components/ornament/PokeballsBox';

const InfoPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  borderRadius: 15,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

const SmallImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: '450px', // Smaller width
  borderRadius: 15,
  marginTop: theme.spacing(2),
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  cursor: 'pointer',
}));

const SliderContainer = styled(Box)(({ theme }) => ({
  maxWidth: '80%',
  margin: '0 auto',
  '& .slick-slide': {
    padding: theme.spacing(0, 1),
  },
  '& .slick-list': {
    padding: theme.spacing(0, 2),
  },
}));

export default function Home() {
  const popularCards = getPopularCards();
  const theme = useTheme();
  const [openImage, setOpenImage] = useState(null);

  const handleClickOpen = (imgSrc) => {
    setOpenImage(imgSrc);
  };

  const handleClose = () => {
    setOpenImage(null);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <Container>
      <StyledBox>
        <PokeballsBox titulo='¡Bienvenido a BidMon Universe!' />
        <Typography variant="h5" align="center" component="div">
          Descubre, colecciona y subasta las cartas más valiosas.
        </Typography>
        <ButtonPrincipal label="¡Únete ahora!" />
      </StyledBox>

      <InfoPaper elevation={4} sx={{ bgcolor: 'error.main', color: 'common.white' }}>
        <Typography variant="h4">¿Qué es BidMon Universe?</Typography>
        <Typography>En BidMon Universe podrás coleccionar y subastar cartas de Pokémon de forma segura y sencilla.
          La plataforma se basa en un sistema de subastas ciegas para asegurar la transparencia y la igualdad de oportunidades para todos los usuarios.
          Las cartas más raras y valiosas están a tu alcance, y te están esperando. ¡Empieza tu colección hoy!</Typography>

        <SliderContainer>
          <Slider {...settings}>
            {popularCards.map((card) => (
              <div key={card._id}>
                <PokemonCard card={card} userCardId='1' onClick={() => { }} />
              </div>
            ))}
          </Slider>
        </SliderContainer>
      </InfoPaper>

      <InfoPaper elevation={4} sx={{ border: '2px solid', borderColor: 'error.main', bgcolor: theme.palette.background.default }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center">
              <SmallImage src="/album.png" alt="Captura de colección de usuario" onClick={() => handleClickOpen("/album.png")} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Cómo empezar</Typography>
            <Typography>Únete a nuestra plataforma y empieza tu colección hoy.</Typography>
            <Typography>Tendrás la posibilidad de adquirir cartas a través de nuestra tienda o participando en subastas en vivo.</Typography>
            <Typography>¡No te pierdas la oportunidad de obtener cartas raras y valiosas!</Typography>
          </Grid>
        </Grid>
      </InfoPaper>

      <InfoPaper elevation={4} sx={{ bgcolor: 'error.main', color: 'common.white' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Explora subastas</Typography>
            <Typography>Explora y participa en subastas en vivo para obtener cartas raras.</Typography>
            <Typography>
              Podrás consultar en tiempo real las subastas activas y pujar por las cartas que más te interesen.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center">
              <SmallImage src="/subastas.png" alt="Captura de subastas" onClick={() => handleClickOpen("/subastas.png")} />
            </Box>
          </Grid>
        </Grid>
      </InfoPaper>

      <InfoPaper elevation={4} sx={{ border: '2px solid', borderColor: 'error.main', bgcolor: theme.palette.background.default }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box display="flex" justifyContent="center">
              <SmallImage src="/detalle_subasta.png" alt="Captura de detalle de subasta" onClick={() => handleClickOpen("/detalle_subasta.png")} />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Transparencia y seguridad</Typography>
            <Typography>Las cartas cuentan con un registro de transacciones que garantiza la trazabilidad de cada carta y ayuda a los usuarios a conocer el mercado de cartas.</Typography>
            <Typography>Además, las subastas se realizan de forma segura y transparente, con un sistema de subastas ciegas que garantiza la igualdad de oportunidades para todos los usuarios.</Typography>
          </Grid>
        </Grid>
      </InfoPaper>


      <Dialog open={Boolean(openImage)} onClose={handleClose}>
        <DialogContent>
          <img src={openImage} alt="Ampliada" style={{ width: '100%' }} />
        </DialogContent>
      </Dialog>
    </Container>
  );
}
