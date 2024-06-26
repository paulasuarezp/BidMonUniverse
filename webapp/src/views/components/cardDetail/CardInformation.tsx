import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CodeIcon from '@mui/icons-material/Code';
import HealthIcon from '@mui/icons-material/Favorite';
import WeightIcon from '@mui/icons-material/FitnessCenter';
import AttackIcon from '@mui/icons-material/FlashOn';
import HeightIcon from '@mui/icons-material/Height';
import DefenseIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import {
    Box,
    CardContent,
    Chip,
    Typography,
    useTheme
} from "@mui/material";
import { useEffect, useState } from 'react';
import { Card as CardType } from "../../../shared/sharedTypes";
import { getCategoryIcon, getCategoryName, getPokemonGymImg } from '../card/CardUtils';


// #region PROPS
interface CardDetailProps {
    card: CardType;
    id: string;
}
// #endregion

// #region COMPONENT CardInformation
/**
 * Información de la carta
 * @param card - Carta
 * @param id - ID de la carta
 */
export default function CardInformation({ card, id }: CardDetailProps) {
    const theme = useTheme();
    const [descriptions, setDescriptions] = useState([]);
    const [hasGym, setHasGym] = useState(false);

    useEffect(() => {
        let descrs = card.description[0].split('@NEWDESCRIPTION@');
        setDescriptions(descrs);
        if (card.gym && card.gym[0] !== 'none') {
            setHasGym(true);
        }
    }, [card]);

    // Estilo del chip
    const chipStyle = {
        backgroundImage: `linear-gradient(-135deg, ${theme.palette.primary.main}, ${theme.palette.background.paper})`,
        color: theme.palette.primary.contrastText,
        margin: 5,
        fontWeight: 'bold'
    };

    return (
        <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h5" gutterBottom>Detalles de la carta</Typography>
            <Box display="flex" alignItems="center"><CodeIcon sx={{ mr: 1 }} /><Typography><strong>ID:</strong> {id}</Typography></Box>
            <Box display="flex" alignItems="center">{getCategoryIcon(card.rarity)}<Typography><strong>Rareza:</strong> {getCategoryName(card.rarity)}</Typography></Box>
            <Box display="flex" alignItems="center"><HealthIcon sx={{ mr: 1, color: '#e91e63' }} /><Typography><strong>HP:</strong> {card.hp}</Typography></Box>
            <Box display="flex" alignItems="center"><AttackIcon sx={{ mr: 1, color: '#ff9800' }} /><Typography><strong>Ataque:</strong> {card.attack}</Typography></Box>
            <Box display="flex" alignItems="center"><DefenseIcon sx={{ mr: 1, color: '#3f51b5' }} /><Typography><strong>Defensa:</strong> {card.defense}</Typography></Box>
            <Box display="flex" alignItems="center"><SpeedIcon sx={{ mr: 1, color: '#4caf50' }} /><Typography><strong>Velocidad:</strong> {card.speed}</Typography></Box>
            <Box display="flex" alignItems="center"><WeightIcon sx={{ mr: 1, color: '#9c27b0' }} /><Typography><strong>Peso:</strong> {card.weight}</Typography></Box>
            <Box display="flex" alignItems="center"><HeightIcon sx={{ mr: 1, color: '#00bcd4' }} /><Typography><strong>Altura:</strong> {card.height}</Typography></Box>
            <Box display="flex" alignItems="center"><CalendarTodayIcon sx={{ mr: 1, color: '#795548' }} /><Typography><strong>Fecha de lanzamiento:</strong> {new Date(card.releaseDate).toLocaleDateString()}</Typography></Box>
            {card.is_legendary && <Typography><strong>¡Es un Pokémon legendario!</strong></Typography>}
            {card.is_mythical && <Typography><strong>¡Es un Pokémon mítico!</strong></Typography>}

            {hasGym && (
                <Box display="flex" justifyContent='center' sx={{ mt: 2 }}>
                    <Chip
                        icon={<img src={getPokemonGymImg(card.gym[0])} alt={card.gym[0]} style={{ width: 24, height: 24 }} />}
                        label={`Gimnasio ${card.gym[0]}`}
                        style={chipStyle}
                        variant="outlined"
                        size="medium"
                    />
                </Box>
            )}

            <Typography align="center" gutterBottom sx={{ mt: 4 }}>
                <AutoAwesomeIcon sx={{ mr: 1 }} style={{ color: '#FFD700' }} />
                {descriptions[0]}
                <AutoAwesomeIcon sx={{ ml: 1 }} style={{ color: '#FFD700' }} />
            </Typography>

        </CardContent>
    );
}
// #endregion