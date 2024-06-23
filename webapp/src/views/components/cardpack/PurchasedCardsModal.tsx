import { Box, Grid, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import PokemonCard from '../card/PokemonCard';

export default function PurchasedCardsModal({ cards, open, handleClose }) {
    const navigate = useNavigate();
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const navigateToAlbum = () => {
        handleClose();
        navigate('/album');
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                borderRadius: 5

            }}>
                <Typography id="modal-modal-title" variant="h5" component="h2" align='center' sx={{ mb: 2 }}>
                    ¡Enhorabuena! 🥳
                    <br />
                    Has adquirido las siguientes cartas:
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {cards.map((card, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <PokemonCard
                                card={card}
                                userCardId={card._id}
                                onClick={() => { }}
                                canFlip={true}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Box display='flex' justifyContent='center' mt={3} gap={2}>
                    <Button onClick={handleClose} label='Cerrar' buttonType='ghost' />
                    <Button onClick={navigateToAlbum} label='Ver en mi colección' buttonType='primary' />
                </Box>
            </Box>
        </Modal>
    );
}
