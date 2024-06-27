import { Grid, GridProps, Typography, useMediaQuery, useTheme } from '@mui/material';

// #region PROPS
interface PokeballsBoxProps extends GridProps {
    titulo: string;
}
// #endregion

// #region COMPONENT PokeballsBox
// Componente que muestra una caja con pokeballs a los lados y un título en el centro
export default function PokeballsBox({ titulo, ...props }: PokeballsBoxProps) {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('xs'));
    const isSm = useMediaQuery(theme.breakpoints.down('sm'));
    const isMd = useMediaQuery(theme.breakpoints.down('md'));
    const isLg = useMediaQuery(theme.breakpoints.down('lg'));

    // Función para determinar el número de columnas para las imágenes en función del tamaño de la pantalla
    const getImageColumns = () => {
        if (isXs) return 1;
        if (isSm) return 1;
        if (isMd) return 4;
        if (isLg) return 5;
        return 5;
    };

    const imageColumns = getImageColumns();
    const totalImages = imageColumns * 2; // número total de imágenes (izquierda + derecha)

    return (
        <Grid container spacing={0} justifyContent="center" alignItems="center" style={{ padding: '1em', width: '100%' }} {...props}>
            {Array.from({ length: imageColumns }, (_, index) => (
                <Grid item xs key={`left-${index}`} style={{ maxWidth: '40px', padding: '0 2px' }}>
                    <img src="/pokeball.png" alt="Pokeball" style={{ width: '100%' }} />
                </Grid>
            ))}
            <Grid item style={{ flexGrow: 1, maxWidth: `calc(100% - ${40 * totalImages}px)` }}>
                {isXs || isSm ?
                    <Typography variant="h4" style={{ textAlign: 'center' }}>
                        {titulo}
                    </Typography>
                    : <Typography variant="h3" style={{ textAlign: 'center' }}>
                        {titulo}
                    </Typography>}

            </Grid>
            {Array.from({ length: imageColumns }, (_, index) => (
                <Grid item xs key={`right-${index}`} style={{ maxWidth: '40px', padding: '0 2px' }}>
                    <img src="/pokeball.png" alt="Pokeball" style={{ width: '100%' }} />
                </Grid>
            ))}
        </Grid>
    );
}
// #endregion