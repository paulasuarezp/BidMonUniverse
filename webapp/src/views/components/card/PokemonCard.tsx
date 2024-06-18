import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Box, Card, CardContent, CardMedia, Chip } from "@mui/material";
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