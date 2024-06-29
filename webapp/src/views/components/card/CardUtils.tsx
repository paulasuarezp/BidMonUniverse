import DiamondIcon from '@mui/icons-material/Diamond';
import GradeIcon from '@mui/icons-material/Grade';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarsIcon from '@mui/icons-material/Stars';
import { CardRarity, PokemonGym } from '../../../shared/sharedTypes';

export const rarityColors = {
    common: '#808080', // SlateGray
    rare: '#4169E1', // RoyalBlue
    ultraRare: '#FFD700', // Gold
    legendary: '#8A2BE2', // BlueViolet
    mythical: '#DC143C' // Crimson
};

export function getCategoryIcon(rarity: CardRarity) {
    if (!rarity) return null;
    switch (rarity) {
        case CardRarity.Common:
            return <StarBorderIcon sx={{ mr: 1, color: rarityColors.common }} />;
        case CardRarity.Rare:
            return <StarIcon sx={{ mr: 1, color: rarityColors.rare }} />;
        case CardRarity.UltraRare:
            return <GradeIcon sx={{ mr: 1, color: rarityColors.ultraRare }} />;
        case CardRarity.Legendary:
            return <StarsIcon sx={{ mr: 1, color: rarityColors.legendary }} />;
        case CardRarity.Mythical:
            return <DiamondIcon sx={{ mr: 1, color: rarityColors.mythical }} />;
        default:
            return null;
    }
}



export function getCardGradient(rarity: CardRarity) {
    if (!rarity) return '';
    switch (rarity) {
        case CardRarity.Common:
            return 'linear-gradient(to top, #708090, #E0FFFF)'; // SlateGray to LightCyan
        case CardRarity.Rare:
            return 'linear-gradient(to top, #4169E1, #87CEFA)'; // RoyalBlue to LightSkyBlue
        case CardRarity.UltraRare:
            return 'linear-gradient(to top, #FFD700, #FFFACD)'; // Gold to LemonChiffon
        case CardRarity.Legendary:
            return 'linear-gradient(to top, #8A2BE2, #DDA0DD)'; // BlueViolet to Plum
        case CardRarity.Mythical:
            return 'linear-gradient(to top, #DC143C, #FFB6C1)'; // Crimson to LightPink
        default:
            return '';
    }
}

export function getPokemonGymImg(pokemonGym: PokemonGym) {
    pokemonGym = pokemonGym.toLowerCase() as PokemonGym;
    switch (pokemonGym) {
        case PokemonGym.Saffron:
            return '/gymBadges/saffron_marsh.png';
        case PokemonGym.Pewter:
            return '/gymBadges/pewter_boulder.png';
        case PokemonGym.Cerulean:
            return '/gymBadges/cerulean_cascade.png';
        case PokemonGym.Vermilion:
            return '/gymBadges/vermilion_thunder.png';
        case PokemonGym.Celadon:
            return '/gymBadges/celadon_rainbow.png';
        case PokemonGym.Fuchsia:
            return '/gymBadges/fuchsia_soul.png';
        case PokemonGym.Cinnabar:
            return '/gymBadges/cinnabar_volcano.png';
        case PokemonGym.Viridian:
            return '/gymBadges/viridian_earth.png';
        default:
            return '';
    }
}



export function getCategoryStyles(rarity: CardRarity) {
    if (!rarity) return {};
    switch (rarity) {
        case CardRarity.Common:
            return { backgroundColor: 'rgba(119,136,153,0.5)' };
        case CardRarity.Rare:
            return { backgroundColor: 'rgba(65,105,225,0.5)' };
        case CardRarity.UltraRare:
            return { backgroundColor: 'rgba(255,215,0,0.5)' };
        case CardRarity.Legendary:
            return { backgroundColor: 'rgba(138,43,226,0.5)' };
        case CardRarity.Mythical:
            return { backgroundColor: 'rgba(220,20,60,0.5)' };
        default:
            return {};
    }
}


export function getCategoryName(rarity: CardRarity) {
    if (!rarity) return '';
    switch (rarity) {
        case CardRarity.Common:
            return 'Común';
        case CardRarity.Rare:
            return 'Rara';
        case CardRarity.UltraRare:
            return 'Ultra rara';
        case CardRarity.Legendary:
            return 'Legendaria';
        case CardRarity.Mythical:
            return 'Mítica';
        default:
            return '';
    }
}

export function getCardColor(rarity: CardRarity) {
    if (!rarity) return '';
    switch (rarity) {
        case CardRarity.Common:
            return 'rgba(119,136,153,1)';
        case CardRarity.Rare:
            return 'rgba(65,105,225,1)';
        case CardRarity.UltraRare:
            return 'rgba(255,215,0,1)';
        case CardRarity.Legendary:
            return 'rgba(138,43,226,1)';
        case CardRarity.Mythical:
            return 'rgba(220,20,60,1)';
        default:
            return '';
    }
}

export function getBackgroundImage(pokemonType: string) {
    switch (pokemonType.toLowerCase()) {
        case 'bug':
            return '/cardsBackgrounds/bug.webp';
        case 'dark':
            return '/cardsBackgrounds/dark.avif';
        case 'dragon':
            return '/cardsBackgrounds/dragon.avif';
        case 'fairy':
            return '/cardsBackgrounds/fairy.jpeg';
        case 'fighting':
            return '/cardsBackgrounds/fighting.jpeg';
        case 'flying':
            return '/cardsBackgrounds/flying.avif';
        case 'fire':
            return '/cardsBackgrounds/fire.jpg';
        case 'ghost':
            return '/cardsBackgrounds/ghost.avif';
        case 'grass':
            return '/cardsBackgrounds/grass.webp';
        case 'ground':
            return '/cardsBackgrounds/ground.jpeg';
        case 'ice':
            return '/cardsBackgrounds/ice.webp';
        case 'poison':
            return '/cardsBackgrounds/poison.webp';
        case 'rock':
            return '/cardsBackgrounds/rocks.webp';
        case 'water':
            return '/cardsBackgrounds/water.jpeg';
        case 'electric':
            return '/cardsBackgrounds/electric.jpeg';
        case 'psychic':
            return '/cardsBackgrounds/psychic.jpeg';
        case 'steel':
            return '/cardsBackgrounds/steel.jpeg';
        default:
            return '/cardsBackgrounds/normal.webp';
    }
}

export function getTypeBadge(pokemonType: string) {
    switch (pokemonType) {
        case 'bug':
            return '/pokemonTypesBadges/bug.svg';
        case 'dark':
            return '/pokemonTypesBadges/dark.svg';
        case 'dragon':
            return '/pokemonTypesBadges/dragon.svg';
        case 'fairy':
            return '/pokemonTypesBadges/fairy.svg';
        case 'fighting':
            return '/pokemonTypesBadges/fighting.svg';
        case 'flying':
            return '/pokemonTypesBadges/flying.svg';
        case 'fire':
            return '/pokemonTypesBadges/fire.svg';
        case 'ghost':
            return '/pokemonTypesBadges/ghost.svg';
        case 'grass':
            return '/pokemonTypesBadges/grass.svg';
        case 'ground':
            return '/pokemonTypesBadges/ground.svg';
        case 'ice':
            return '/pokemonTypesBadges/ice.svg';
        case 'poison':
            return '/pokemonTypesBadges/poison.svg';
        case 'rock':
            return '/pokemonTypesBadges/rock.svg';
        case 'water':
            return '/pokemonTypesBadges/water.svg';
        case 'electric':
            return '/pokemonTypesBadges/electric.svg';
        case 'psychic':
            return '/pokemonTypesBadges/psychic.svg';
        case 'steel':
            return '/pokemonTypesBadges/steel.svg';
        default:
            return '/pokemonTypesBadges/normal.svg';
    }
}

export function getTypeName(pokemonType: string) {
    switch (pokemonType) {
        case 'bug':
            return 'Bicho';
        case 'dark':
            return 'Siniestro';
        case 'dragon':
            return 'Dragón';
        case 'fairy':
            return 'Hada';
        case 'fighting':
            return 'Lucha';
        case 'flying':
            return 'Volador';
        case 'fire':
            return 'Fuego';
        case 'ghost':
            return 'Fantasma';
        case 'grass':
            return 'Planta';
        case 'ground':
            return 'Tierra';
        case 'ice':
            return 'Hielo';
        case 'poison':
            return 'Veneno';
        case 'rock':
            return 'Roca';
        case 'water':
            return 'Agua';
        case 'electric':
            return 'Eléctrico';
        case 'psychic':
            return 'Psíquico';
        case 'steel':
            return 'Acero';
        default:
            return 'Normal';
    }
}

export const typeStyles = {
    bug: {
        background: '#92BC2C',
        boxShadow: '0 0 20px #92BC2C',
        filter: 'brightness(1.2)',
    },
    dark: {
        background: '#595761',
        boxShadow: '0 0 20px #595761',
        filter: 'brightness(1.2)',
    },
    dragon: {
        background: '#0C69C8',
        boxShadow: '0 0 20px #0C69C8',
        filter: 'brightness(1.2)',
    },
    fairy: {
        background: '#EE90E6',
        boxShadow: '0 0 20px #EE90E6',
        filter: 'brightness(1.2)',
    },
    fighting: {
        background: '#D3425F',
        boxShadow: '0 0 20px #D3425F',
        filter: 'brightness(1.2)',
    },
    flying: {
        background: '#A1BBEC',
        boxShadow: '0 0 20px #A1BBEC',
        filter: 'brightness(1.2)',
    },
    fire: {
        background: '#FBA54C',
        boxShadow: '0 0 20px #FBA54C',
        filter: 'brightness(1.2)',
    },
    ghost: {
        background: '#5F6DBC',
        boxShadow: '0 0 20px #5F6DBC',
        filter: 'brightness(1.2)',
    },
    grass: {
        background: '#5FBD58',
        boxShadow: '0 0 20px #5FBD58',
        filter: 'brightness(1.2)',
    },
    ground: {
        background: '#DA7C4D',
        boxShadow: '0 0 20px #DA7C4D',
        filter: 'brightness(1.2)',
    },
    ice: {
        background: '#75D0C1',
        boxShadow: '0 0 20px #75D0C1',
        filter: 'brightness(1.2)',
    },
    normal: {
        background: '#A0A29F',
        boxShadow: '0 0 20px #A0A29F',
        filter: 'brightness(1.2)',
    },
    poison: {
        background: '#B763CF',
        boxShadow: '0 0 20px #B763CF',
        filter: 'brightness(1.2)',
    },
    psychic: {
        background: '#FA8581',
        boxShadow: '0 0 20px #FA8581',
        filter: 'brightness(1.2)',
    },
    rock: {
        background: '#C9BB8A',
        boxShadow: '0 0 20px #C9BB8A',
        filter: 'brightness(1.2)',
    },
    steel: {
        background: '#5695A3',
        boxShadow: '0 0 20px #5695A3',
        filter: 'brightness(1.2)',
    },
    water: {
        background: '#539DDF',
        boxShadow: '0 0 20px #539DDF',
        filter: 'brightness(1.2)',
    },
    electric: {
        background: '#F2D94E',
        boxShadow: '0 0 20px #F2D94E',
        filter: 'brightness(1)',
    },
};



export { };
