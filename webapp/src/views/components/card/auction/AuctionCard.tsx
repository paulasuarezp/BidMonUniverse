import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../../redux/store";
import { AccessLevel, Card as CardType } from "../../../../shared/sharedTypes";
import DurationButton from "../../buttons/duration/DurationButton";
import PokemonCard from "../../card/PokemonCard";

// #region PROPS
interface AuctionCardProps {
    card: CardType;
    duration: number;
    userCardId: string;
    auctionId: string;
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
}));
// #endregion


// #region COMPONENT AuctionCard
// Carta de subasta
export default function AuctionCard({ card, userCardId, duration, auctionId }: AuctionCardProps) {
    const navigate = useNavigate();
    const sessionUser = useSelector((state: RootState) => state.user);

    const handleCardClick = () => {
        if (sessionUser.role === AccessLevel.Admin) {
            navigate(`/admin/auction/${auctionId}`);
        } else {
            navigate(`/auctions/${auctionId}`);
        }
    }
    return (
        <HoverEffectContainer>
            <PokemonCard
                card={card}
                type="auction"
                userCardId={userCardId}
                onClick={handleCardClick}
                aria-label={`Carta de subasta de ${card.name}`}
            />
            <DurationButton
                duration={duration}
                sx={{ marginTop: '10px' }}
                className="hover-effect"
                role='status'
                aria-label={`Duración de la subasta: ${duration} días`}
            />
        </HoverEffectContainer>
    );
}
// #endregion