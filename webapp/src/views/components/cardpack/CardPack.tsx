import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material';
import { CardPack as CardPackType } from '../../../shared/sharedTypes';
import Button from '../buttons/Button';
import CoinsButton from '../buttons/coins/CoinsButton';
import { getCategoryIcon } from '../card/CardUtils';

interface PackProps {
    cardpack: CardPackType;
    onOpen: () => void;
}

function getDeckName(name: string): string {
    switch (name) {
        case 'Deck Common':
            return 'Mazo Común';
        case 'Deck Rare':
            return 'Mazo Raro';
        case 'Deck UltraRare':
            return 'Mazo Ultra Raro';
        case 'Deck Legendary':
            return 'Mazo legendario';
        case 'Deck Mythical':
            return 'Mazo Mítico';
        default:
            return name;
    }
}

export default function CardPack({ cardpack, onOpen }: PackProps) {
    const theme = useTheme();

    return (
        <Card sx={{ width: '100%', height: 480, borderRadius: '15px', boxShadow: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardMedia
                component="img"
                sx={{ height: 200, objectFit: 'cover' }}
                image={cardpack.image}
                alt={cardpack.name}
            />
            <CardContent sx={{ flexGrow: 1, padding: theme.spacing(2) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography gutterBottom variant="h5" component="div">
                            {cardpack.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Contiene <strong>{cardpack.numberOfCards}</strong> cartas
                        </Typography>
                    </Box>
                    <CoinsButton balance={cardpack.price} sx={{ color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Puedes conseguir cartas de los siguientes mazos:
                </Typography>
                <List sx={{ padding: 0 }}>
                    {cardpack.deck1 && (
                        <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                                {getCategoryIcon(cardpack.deck1.type)}
                            </ListItemIcon>
                            <ListItemText secondary={`${cardpack.quantity1} cartas de ${getDeckName(cardpack.deck1.name)}`} />
                        </ListItem>
                    )}
                    {cardpack.deck2 && (
                        <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                                {getCategoryIcon(cardpack.deck2.type)}
                            </ListItemIcon>
                            <ListItemText secondary={`${cardpack.quantity2} cartas de ${getDeckName(cardpack.deck2.name)}`} />
                        </ListItem>
                    )}
                    {cardpack.deck3 && (
                        <ListItem sx={{ paddingTop: 0, paddingBottom: 0 }}>
                            <ListItemIcon sx={{ minWidth: '30px' }}>
                                {getCategoryIcon(cardpack.deck3.type)}
                            </ListItemIcon>
                            <ListItemText secondary={`${cardpack.quantity3} cartas de ${getDeckName(cardpack.deck3.name)}`} />
                        </ListItem>
                    )}
                </List>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', paddingBottom: theme.spacing(2) }}>
                <Button buttonType='primary' label='Comprar sobre' fullWidth onClick={onOpen} />
            </CardActions>
        </Card>
    );
}
