import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from "react-router-dom";
import { Card as CardType } from "../../../../shared/sharedTypes";
import CoinsButton from '../../buttons/coins/CoinsButton';
import DurationButton from "../../buttons/duration/DurationButton";
import PokemonCard from "../PokemonCard";

// #region PROPS
interface BidCardProps {
    card: CardType;
    duration: number;
    userCardId: string;
    bidId: string;
    price: number;
}
// #endregion

// #region STYLES
const HoverEffectContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '&:hover .hover-effect': {
        boxShadow: theme.palette.mode === 'light' ?
            '2px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.25)' :
            '2px 2px 2px 0px rgba(72, 187, 120, 0.35), 0px 0px 2px 0px rgba(72, 187, 120, 0.35)',
        textShadow: theme.palette.mode === 'light' ?
            '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)' :
            '0 0 10px rgba(72, 187, 120, 0.6), 0 0 20px rgba(72, 187, 120, 0.4)',
        borderBottom: '2px solid #48BB78',
        borderRight: '2px solid #48BB78',
        backgroundColor: 'rgba(72, 187, 120, 0.4)',
    },
    '&:hover .hover-effect-coins': {
        boxShadow: theme.palette.mode === 'light' ?
            '2px 2px 2px 0px rgba(255, 255, 255, 0.25), 0px 0px 2px 0px rgba(255, 255, 255, 0.25)' :
            '2px 2px 2px 0px rgba(229, 62, 48, 0.35), 0px 0px 2px 0px rgba(229, 62, 48, 0.35)',
        textShadow: theme.palette.mode === 'light' ?
            '0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4)' :
            '0 0 10px rgba(229, 62, 48, 0.6), 0 0 20px rgba(229, 62, 48, 0.4)',
        borderBottom: '2px solid #F8E260',
        borderRight: '2px solid #F8E260',
        backgroundColor: 'rgba(248, 226, 96, 0.4)',

    },
}));
// #endregion

// #region COMPONENT BidCard
// Carta de puja
export default function BidCard({ card, userCardId, duration, price, bidId }: BidCardProps) {
    const navigate = useNavigate();
    const theme = useTheme();

    const handleCardClick = () => {
        navigate(`/bids/${bidId}`);
    }
    return (
        <HoverEffectContainer>
            <PokemonCard card={card} type="auction" userCardId={userCardId} onClick={handleCardClick} />
            <DurationButton
                duration={duration}
                sx={{ marginTop: '10px', padding: "0.2em" }}
                className="hover-effect"
                role="status"
                aria-live="polite"
                aria-label={`Duración de la subasta: ${duration} horas`}
            />
            <CoinsButton
                balance={price}
                onClick={() => { }}
                className="hover-effect-coins"
                sx={{ color: theme.palette.mode === 'light' ? '#000000' : '#FFFFFF', marginTop: '5px', padding: "0.2em" }}
                role="status"
                aria-live="polite"
                aria-label={`Precio actual: ${price} monedas`}
            />
        </HoverEffectContainer>
    );
}
// #endregion