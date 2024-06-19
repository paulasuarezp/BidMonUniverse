import PokemonCard from "../card/PokemonCard";
import { Card as CardType } from "../../../shared/sharedTypes";
import DurationButton from "../buttons/duration/DurationButton";
import { styled } from '@mui/material/styles';

interface AuctionCardProps {
    card: CardType;
    duration: number;
    userCardId: string;
}

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


export default function AuctionCard({ card, userCardId, duration }: AuctionCardProps) {
    return (
        <HoverEffectContainer>
            <PokemonCard card={card} type="auction" userCardId={userCardId} />
            <DurationButton duration={duration} sx={{ marginTop: '10px' }} className="hover-effect" />

        </HoverEffectContainer>
    );
}
