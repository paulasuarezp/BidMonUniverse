import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Card, CardRarity, PokemonGym, PokemonType } from '../../shared/sharedTypes';
import PokemonCard from '../../views/components/card/PokemonCard';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const auxCard: Card =
{
    _id: '6661e0331e0b158d0f0cdb24',
    cardId: 'c-6-5',
    pokemonId: 6,
    name: 'charizard',
    rarity: CardRarity.UltraRare,
    releaseDate: new Date(1717690030000),
    availableQuantity: 100,
    cards: [],
    pokemonType: PokemonType.Fire,
    description: [
        'Cuando lanza una descarga de fuego supercaliente, la roja llama de su cola brilla más intensamente.',
        'Con las alas que tiene puede alcanzar una altura de casi 1400 m. Suele escupir fuego por la boca.',
        'Charizard se dedica a volar por los cielos en busca de oponentes fuertes. Echa fuego por la boca y es capaz de derretir cualquier cosa. No obstante, si su rival es más débil que él, no usará este ataque.',
    ],
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/6.svg',
    hp: 78,
    attack: 84,
    defense: 78,
    speed: 100,
    weight: 905,
    height: 17,
    is_legendary: false,
    is_mythical: false,
    n_location_area: 0,
    n_encounters: 0,
    averageMaxChance: 0,
    gym: [PokemonGym.None],
};

describe('PokemonCard Component', () => {

    test('should call onClick function when card is clicked', () => {
        const card = auxCard;
        const handleClick = jest.fn();

        render(
            <Router>
                <PokemonCard card={card} userCardId="1" onClick={handleClick} />
            </Router>
        );

        const cardElement = screen.getByRole('button', { name: /carta de charizard/i });

        fireEvent.click(cardElement);
        expect(handleClick).toHaveBeenCalled();
    });

    test('should navigate to card details when card is clicked and no onClick provided', () => {
        const card = auxCard;

        render(
            <Router>
                <PokemonCard card={card} userCardId="1" />
            </Router>
        );

        const cardElement = screen.getByRole('button', { name: /carta de charizard/i });

        fireEvent.click(cardElement);
        expect(mockNavigate).toHaveBeenCalledWith('/card/1');
    });

    test('should flip the card when clicked if canFlip is true', () => {
        const card = auxCard;

        render(
            <Router>
                <PokemonCard card={card} userCardId="1" canFlip={true} />
            </Router>
        );

        const cardElement = screen.getByRole('button', { name: /carta de charizard/i });

        expect(cardElement).toHaveAttribute('aria-pressed', 'true'); // Inicialmente volteada
        fireEvent.click(cardElement);
        expect(cardElement).toHaveAttribute('aria-pressed', 'false'); // Debería haberse volteado
    });
});
