import {
    Card,
    CardContent
} from "@mui/material";
import { Card as CardType } from "../../../shared/sharedTypes";
import PokemonCard from '../card/PokemonCard';

interface PokemonCardBoxProps {
    card: CardType;
    id: string;
    children?: React.ReactNode;
}


const PokemonCardBox = ({ card, id, children }: PokemonCardBoxProps) => {

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 2 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <PokemonCard card={card} userCardId={id} canFlip={true} maxSize={true} />
                {children}
            </CardContent>
        </Card>

    );
};

export default PokemonCardBox;
