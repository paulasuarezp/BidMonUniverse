import { Box, Grid, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserCard } from '../../../../shared/sharedTypes';
import Button from '../../buttons/Button';
import CoinsButton from '../../buttons/coins/CoinsButton';
import PokemonCard from '../../card/PokemonCard';

interface CloseAuctionsModalProps {
    cards: UserCard[];
    open: boolean;
    handleClose: () => void;
}
export default function CloseAuctionsModal({ cards, open, handleClose }: CloseAuctionsModalProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const navigateToAuctions = () => {
        setTimeout(() => {
            handleClose();
            navigate('/admin/auctions');
        }, 2000);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                maxWidth: fullScreen ? '95vw' : 800,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                overflowY: 'auto',
                maxHeight: '90vh',
                borderRadius: 5,
                transition: 'all 0.3s ease-out'
            }}>
                <Typography id="modal-modal-title" variant="h2" align='center' sx={{ mb: 2, fontWeight: 'medium' }} component="h2">
                    Subastas cerradas
                </Typography>
                <Typography id="modal-modal-description" sx={{ mb: 2 }}>
                    Aquí puedes ver las cartas de las cartas que han sido retiradas de las subastas, y el precio al que se han vendido.
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' sx={{ mb: 1 }}>
                                <PokemonCard
                                    card={card.item}
                                    userCardId={card._id}
                                    onClick={() => { }}
                                    canFlip={true}
                                    aria-label={`Carta de ${card.item.name}`}
                                />
                                {card.initialPrice > 0 &&
                                    <CoinsButton balance={card.initialPrice} sx={{ mt: 2, color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000' }} role='status' aria-label={`Precio inicial: ${card.initialPrice} zens`} />}
                                {(card.initialPrice <= 0 || !card.initialPrice) &&
                                    <Typography variant='body2' align='center' sx={{ mt: 1 }}>
                                        La carta no se ha vendido.
                                    </Typography>}
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <Box display='flex' justifyContent='center' mt={3} gap={2}>
                    <Button onClick={handleClose} label='Cerrar' buttonType='ghost' aria-label="Cerrar modal" />
                    <Button onClick={navigateToAuctions} label='Ver subastas activas' buttonType='primary' aria-label="Ver subastas activas" />
                </Box>
            </Box>
        </Modal>
    );
}