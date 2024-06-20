import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    Box,
    Card,
    Grid,
    Typography,
    useTheme
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { Card as CardType, Transaction } from "../../../shared/sharedTypes";
import { capitalizeFirstLetter } from '../../../utils/utils';
import Button from '../buttons/Button';
import { getCardGradient } from '../card/CardUtils';
import CardInformation from '../cardDetail/CardInformation';
import TableCardDetail from '../table/TableCardDetail';
import PokemonCardBox from './PokemonCardBox';


interface GeneralCardDetailProps {
    id: string;
    card: CardType;
    transactions: Transaction[];
    pokemonBoxChildren: React.ReactNode;
    cardInformationChildren: React.ReactNode;
    form?: React.ReactNode;
}

const GeneralCardDetail = ({ card, transactions, pokemonBoxChildren, cardInformationChildren, form }: GeneralCardDetailProps) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleBack = () => navigate(-1);

    return (
        <Box sx={{ maxWidth: 1200, width: '100%', margin: 'auto', marginTop: 5, padding: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button startIcon={<ArrowBackIcon />}
                variant="contained"
                sx={{ alignSelf: 'flex-start', margin: '10px' }}
                buttonType="ghost"
                onClick={handleBack}
                label='Volver'
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                    variant="h2"
                    align="center"
                    fontFamily={'Pokemon'}
                    mb={2}
                    sx={{
                        color: theme.palette.text.primary,
                        letterSpacing: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    {capitalizeFirstLetter(card.name)}
                </Typography>
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
    );
};

export default GeneralCardDetail;
