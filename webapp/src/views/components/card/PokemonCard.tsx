import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Box, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { CardRarity, Card as CardType, PokemonGym } from "../../../shared/sharedTypes";
import { capitalizeFirstLetter } from '../../../utils/utils';

interface PokemonCardProps {
  card: CardType;
  canFlip?: boolean; // Propiedad opcional para habilitar el giro
  maxSize?: boolean; // Propiedad opcional para habilitar el tamaño máximo
}

function getCategoryStyles(rarity: CardRarity) {
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

function getCardGradient(rarity: CardRarity) {
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

function getCategoryName(rarity: CardRarity) {
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

function getCardColor(rarity: CardRarity) {
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

function getPokemonGymImg(pokemonGym: PokemonGym) {
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

function getBackgroundImage(pokemonType: string) {
  switch (pokemonType) {
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
      return '/cardsBackgrounds/ice.avif';
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

function getTypeBadge(pokemonType: string) {
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
      return 'pokemonTypesBadges/normal.svg';
  }
}

function getTypeName(pokemonType: string) {
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
const typeStyles = {
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

export default function PokemonCard({ card, canFlip = false, maxSize = false }: PokemonCardProps) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);

  let name = card?.name ? capitalizeFirstLetter(card?.name) : 'Pokemon';
  let rarity = card?.rarity || CardRarity.Common;
  let pokemonImage = card?.image || '/pokemon.png';
  let pokemonType = card?.pokemonType || 'normal';
  let pokemonGymImg = card?.gym[0] ? getPokemonGymImg(card?.gym[0]) : 'none';
  let id = card?.cardId || 0;

  const borderColor = getCardColor(rarity);
  const backgroundImage = getBackgroundImage(pokemonType);
  const borderGradient = getCardGradient(rarity);
  const typeImg = getTypeBadge(pokemonType);
  const typeName = getTypeName(pokemonType);

  let backgroundImageCard = flipped ? `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/cardsBackgrounds/back.webp') center / cover no-repeat` : `url(${backgroundImage}) center / cover no-repeat`;
  let border = !flipped ? '10px solid' : `0px`;
  const handleCardClick = () => {
    if (canFlip) {
      setFlipped(!flipped);
    } else {
      navigate(`/card/${id}`);
    }
  };


  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: maxSize ? { xs: 200, sm: 200, md: 240, lg: 260, xl: 320 } : { xs: 150, sm: 150, md: 180, lg: 200, xl: 250 },
        height: maxSize ? { xs: 280, sm: 280, md: 320, lg: 340, xl: 400 } : { xs: 200, sm: 200, md: 220, lg: 240, xl: 300 },

        borderRadius: '10px',
        background: backgroundImageCard,
        border: border,
        borderImage: `${borderGradient} 1`,
        position: 'relative',
        color: 'white',
        overflow: 'visible',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        cursor: 'pointer',
        '&:hover': {
          transform: !flipped ? 'scale(1.05)' : 'rotateY(180deg)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)'
        }
      }}
    >
      {pokemonGymImg !== 'none' && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(${pokemonGymImg}) center / contain no-repeat`,
          opacity: 0.5,
        }} />
      )}
      <Box sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }}>
        <Avatar
          src={typeImg}
          alt={typeName}

          sx={{
            ...typeStyles[pokemonType],
            width: 30,
            padding: 0.2,
            height: 'auto',
            color: 'white',
            textShadow: '1px 1px 2px black',
            visibility: flipped ? 'hidden' : 'visible'
          }}
        />
      </Box>

      <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
        <Chip label={getCategoryName(rarity)}
          sx={{
            ...getCategoryStyles(rarity),
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px black',
            visibility: flipped ? 'hidden' : 'visible'
          }}
        />
      </Box>
      <CardMedia
        component="img"
        image={pokemonImage}
        alt={name}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          margin: 'auto',
          backfaceVisibility: 'hidden',
          visibility: flipped ? 'hidden' : 'visible'
        }}
      />
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: '16px',
        paddingTop: '0px',
        '&:last-child': {
          paddingBottom: 0,
        },
        backfaceVisibility: 'hidden'
      }}>
        <Box sx={{
          position: 'absolute',
          bottom: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1
        }}>
          <Chip label={name} sx={{
            bgcolor: `${borderColor}`,
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px black',
          }} />
        </Box>
      </CardContent>
    </Card>
  );
}