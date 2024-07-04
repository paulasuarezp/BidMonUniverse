import {
    Alert,
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
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { CardPack as CardPackType } from '../../../shared/sharedTypes';
import Button from '../buttons/Button';
import CoinsButton from '../buttons/coins/CoinsButton';
import { getCategoryIcon } from '../card/CardUtils';
import PurchaseCardpackConfirm from '../forms/cardpack/CardpackForm';
import './cardPack.css';

interface PackProps {
    cardpack: CardPackType;
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

export default function CardPack({ cardpack }: PackProps) {
    const theme = useTheme();
    const [showBuyButton, setShowBuyButton] = useState(true);

    const [openModal, setOpenModal] = useState(false);

    const balance = useSelector((state: RootState) => state.user.balance);

    const handleOpen = () => {
        setOpenModal(true);
    }

    const handleClose = () => {
        setOpenModal(false);
    }

    useEffect(() => {
        setShowBuyButton(cardpack.price <= balance);
    }, [balance]);

    return (
        <Card sx={{
            width: '100%',
            height: 480,
            borderRadius: '15px',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            '&:hover': {
                animation: 'shake 0.5s'
            },
            '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
            }
        }}>
            <CardMedia
                component="img"
                sx={{ height: 200, objectFit: 'cover' }}
                image={cardpack.image}
                alt={cardpack.name}
            />
            <CardContent sx={{ flexGrow: 1, padding: theme.spacing(2) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography gutterBottom variant="h3" component="div">
                            {cardpack.name}
                        </Typography>
                        <Typography color="text.secondary">
                            Contiene <strong>{cardpack.numberOfCards}</strong> cartas
                        </Typography>
                    </Box>
                    <CoinsButton balance={cardpack.price} role='status' sx={{ color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF' }} />
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

            {/* Botón de compra */}
            {showBuyButton && (
                <CardActions sx={{ justifyContent: 'center', paddingBottom: theme.spacing(2) }}>
                    <Button
                        buttonType='primary'
                        label='Comprar sobre'
                        fullWidth
                        onClick={handleOpen}
                        aria-label={`Comprar sobre de ${cardpack.name}`}
                    />
                </CardActions>
            )}

            <PurchaseCardpackConfirm open={openModal} handleClose={handleClose} cardpack={cardpack} />
            {!showBuyButton && (<Alert severity="warning" sx={{ width: '100%', fontSize: '1.1em' }} role='alert' aria-label=' No tienes saldo suficiente para comprar este sobre.'>
                Saldo insuficiente. </Alert>)}

        </Card>
    );
}