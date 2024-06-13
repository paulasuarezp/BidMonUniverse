import { useState, useEffect } from 'react';
import { Grid, useMediaQuery, useTheme, Box } from '@mui/material';
import PokemonCard from '../../card/PokemonCard';
import { getCardsOfUser } from '../../../../api/userCardsAPI';

interface ResponsivePokemonGridProps {
    username: string;
}

const ResponsivePokemonGrid = ({ username }: ResponsivePokemonGridProps) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const [cards, setCards] = useState([]);

    const getGridListCols = () => {
        if (isXs) return 1; // En teléfonos móviles, mostrar una sola columna
        if (isSm) return 2; // En tablets pequeñas, mostrar dos columnas
        if (isMd) return 3; // En tablets grandes, mostrar tres columnas
        if (isLg) return 4; // En pantallas pequeñas de escritorio, mostrar cuatro columnas
        return 6; // En pantallas grandes, mostrar seis columnas
    };

    const numberOfCards = getGridListCols();

    useEffect(() => {
        getCardsOfUser(username)
            .then((data) => {
                setCards(data);
                console.log('Cartas del usuario', data);
            })
            .catch((error) => {
                console.error('Error al obtener las cartas del usuario', error);
            });
    }, []);


    return (
        <Grid container spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            direction="row"
            justifyContent="center"
            alignItems="center"
        >
            {Array.from({ length: cards.length }, (_, index) => (
                <Grid item key={index} style={{ flex: '0 0 auto' }}>
                    <PokemonCard
                        name={cards[index].name}
                        category={cards[index].rarity}
                        backgroundImage="/selva.avif"
                        pokemonImage={cards[index].image}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ResponsivePokemonGrid;