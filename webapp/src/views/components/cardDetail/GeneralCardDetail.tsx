import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Card,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import { Card as CardType, Transaction } from "../../../shared/sharedTypes";
import BasePageWithNav from '../../pages/BasePageWithNav';
import Button from "../buttons/Button";
import { getCardGradient } from '../card/CardUtils';
import CardInformation from '../cardDetail/CardInformation';
import TableCardDetail from '../table/TableCardDetail';
import PokemonCardBox from './PokemonCardBox';

// #region PROPS
interface GeneralCardDetailProps {
    title: string; // Título de la página
    description?: React.ReactNode; // Descripción de la página
    backLabel?: string; // Etiqueta del botón de retroceso
    handleBack?: () => void; // Función para manejar el botón de retroceso
    id: string; // ID de la carta, subasta o puja
    card: CardType; // Carta
    transactions: Transaction[]; // Transacciones de la carta
    pokemonBoxChildren: React.ReactNode; // Contenido del box de la carta
    cardInformationChildren: React.ReactNode; // Contenido de la información de la carta
    form?: React.ReactNode; // Formulario
}
// #endregion

// #region COMPONENT GeneralCardDetail
// Detalle general de una carta
export default function GeneralCardDetail({ card, transactions, pokemonBoxChildren, cardInformationChildren, form, title, description, backLabel, handleBack }: GeneralCardDetailProps) {

    const theme = useTheme();

    return (
        <BasePageWithNav title={title} showBackButton={false} description={description}>
            <Box sx={{ maxWidth: 1200, width: '100%', margin: 'auto', marginTop: 1, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <Button startIcon={<ArrowBackIcon />}
                                variant="contained"
                                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                                buttonType="ghost"
                                onClick={handleBack}
                                label={backLabel}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="h2"
                                align="center"
                                fontFamily="Pokemon"
                                sx={{
                                    color: theme.palette.text.primary,
                                    letterSpacing: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                {card.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={0} sm={4} />  {/* Esta columna vacía ayuda a centrar el texto en la columna del medio y se oculta en móviles */}
                    </Grid>
                    <Box
                        sx={{
                            background: getCardGradient(card.rarity),
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            mb: 2,
                        }}
                    >
                    </Box>
                    <Grid container spacing={2} justifyContent="center" alignItems="stretch">
                        <Grid item xs={12} md={6}>
                            <PokemonCardBox card={card} id={card._id} children={pokemonBoxChildren} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
                                <CardInformation card={card} id={card._id} />
                                {cardInformationChildren}
                            </Card>
                        </Grid>
                    </Grid>
                    {form}
                    <TableCardDetail data={transactions} />
                </Box>
            </Box>
        </BasePageWithNav>
    );
};
//#endregion