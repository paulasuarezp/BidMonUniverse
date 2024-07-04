import {
    Card,
    CardContent
} from "@mui/material";
import { Card as CardType } from "../../../shared/sharedTypes";
import PokemonCard from '../card/PokemonCard';

// #region PROPS
interface PokemonCardBoxProps {
    card: CardType;
    id: string;
    children?: React.ReactNode;
    showFlipped?: boolean;
}
// #endregion

// #region COMPONENT PokemonCardBox
// Box de la carta de Pokémon
export default function PokemonCardBox({ card, id, children, showFlipped }: PokemonCardBoxProps) {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <PokemonCard card={card} userCardId={id} canFlip={true} maxSize={true} showFlipped={showFlipped} />
                {children}
            </CardContent>
        </Card>

    );
};
// #endregion