import { Grid, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserCardCollection } from '../../../../api/api';
import { Card, UserCard } from '../../../../shared/sharedTypes';
import SurpriseMessageBox from '../../MessagesBox/SurpriseMessageBox';
import PokemonCard from '../../card/PokemonCard';

interface ResponsivePokemonGridProps {
    username: string;
    limit?: boolean;
}

const ResponsivePokemonGrid = ({ username, limit = true }: ResponsivePokemonGridProps) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    const [cards, setCards] = useState<UserCard[]>([]);
    const [numberOfCards, setNumberOfCards] = useState<number>(0);

    const getGridListCols = () => {
        if (isXs) return 1; // En teléfonos móviles, mostrar una sola columna
        if (isSm) return 2; // En tablets pequeñas, mostrar dos columnas
        if (isMd) return 3; // En tablets grandes, mostrar tres columnas
        if (isLg) return 4; // En pantallas pequeñas de escritorio, mostrar cuatro columnas
        return 6; // En pantallas grandes, mostrar seis columnas
    };


    useEffect(() => {
        getUserCardCollection(username)
            .then((data) => {
                setCards(data);
                console.log('Cartas del usuario', data);
                if (limit) {
                    // Si hay límite, ajusta el número de cartas basado en el tamaño de la pantalla.
                    const initialCount = getGridListCols();
                    setNumberOfCards(Math.min(data.length, initialCount));
                } else {
                    // Si no hay límite, usa todas las cartas.
                    setNumberOfCards(data.length);
                }
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
            style={{ padding: '1em', marginBottom: '2em' }}
        >
            {Array.from({ length: numberOfCards }, (_, index) => (
                <Grid item key={index} style={{ flex: '0 0 auto' }}>
                    <PokemonCard
                        card={cards[index].item as Card}
                        userCardId={cards[index]._id}
                    />
                </Grid>
            ))}
            {numberOfCards === 0 && <SurpriseMessageBox />}
        </Grid>
    );
};

export default ResponsivePokemonGrid;