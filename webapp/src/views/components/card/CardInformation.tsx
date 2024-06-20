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
    Typography
} from "@mui/material";
import { useEffect, useState } from 'react';
import { Card as CardType } from "../../../shared/sharedTypes";
import { getCategoryIcon, getCategoryName, getPokemonGymImg } from './CardUtils';


interface CardDetailProps {
    card: CardType;
    id: string;
}
export default function CardInformation({ card, id }: CardDetailProps) {
    const [descriptions, setDescriptions] = useState([]);
    const [hasGym, setHasGym] = useState(false);

    useEffect(() => {
        let descrs = card.description[0].split('@NEWDESCRIPTION@');
        setDescriptions(descrs);
        if (card.gym && card.gym[0] !== 'none') {
            setHasGym(true);
        }
    }, [card]);

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
            {hasGym && <Typography><strong>Gimnasio:</strong> {card.gym.map((gym) => <img key={gym} src={getPokemonGymImg(gym)} alt={gym} style={{ width: 50, height: 50, margin: 5 }} />)}</Typography>}

            <Typography align="center" gutterBottom sx={{ mt: 4 }}>
                <AutoAwesomeIcon sx={{ mr: 1 }} style={{ color: '#FFD700' }} />
                {descriptions[0]}
                <AutoAwesomeIcon sx={{ ml: 1 }} style={{ color: '#FFD700' }} />
            </Typography>

        </CardContent>
    );
}