import { Box, Card, CardContent, CardMedia, Chip } from "@mui/material";

interface PokemonCardProps {
  name: string;
  category: string;
  pokemonType: string;
  pokemonImage: string;
}

function getCategoryStyles(category: PokemonCardProps['category']) {
  switch (category) {
    case 'common':
      return { backgroundColor: 'rgba(119,136,153,0.5)' };
    case 'rare':
      return { backgroundColor: 'rgba(65,105,225,0.5)' };
    case 'ultrarare':
      return { backgroundColor: 'rgba(255,215,0,0.5)' };
    case 'legendary':
      return { backgroundColor: 'rgba(138,43,226,0.5)' };
    case 'mythical':
      return { backgroundColor: 'rgba(220,20,60,0.5)' };
    default:
      return {};
  }
}

function getCategoryName(category: PokemonCardProps['category']) {
  switch (category) {
    case 'common':
      return 'Común';
    case 'rare':
      return 'Rara';
    case 'ultrarare':
      return 'Ultra rara';
    case 'legendary':
      return 'Legendaria';
    case 'mythical':
      return 'Mítica';
    default:
      return '';
  }
}

function getCardColor(category: PokemonCardProps['category']) {
  switch (category) {
    case 'common':
      return 'rgba(119,136,153,1)';
    case 'rare':
      return 'rgba(65,105,225,1)';
    case 'ultrarare':
      return 'rgba(255,215,0,1)';
    case 'legendary':
      return 'rgba(138,43,226,1)';
    case 'mythical':
      return 'rgba(220,20,60,1)';
    default:
      return '';
  }
}


function getBackgroundImage(pokemonType: string) {
  //return `/cardsBackgrounds/${pokemonType}.png`;
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

const getFloralSVG = (color) => {
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='%23${color}'%3E...%3C/svg%3E")`;
};



export default function PokemonCard({ name, category, pokemonType, pokemonImage }: PokemonCardProps) {
  const borderColor = getCardColor(category);
  const backgroundImage = getBackgroundImage(pokemonType);

  return (
    <Card sx={{
      width: { xs: 150, sm: 150, md: 180, lg: 200, xl: 250 },
      height: { xs: 200, sm: 200, md: 220, lg: 240, xl: 300 },
      borderRadius: '10px',
      background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${backgroundImage}) center / cover no-repeat`,
      border: `10px solid ${borderColor}`,
      position: 'relative',
      color: 'white',
      overflow: 'visible',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: 0,
        right: 0,
        height: '40px',
        background: `radial-gradient(circle at 20px 20px, ${borderColor}, transparent 30%)`,
        backgroundSize: '40px 40px',
        backgroundRepeat: 'repeat-x'
      }
    }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
        <Chip label={getCategoryName(category)}
          sx={{
            ...getCategoryStyles(category),
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px black',
          }}
        />
      </Box>
      <CardMedia
        component="img"
        image={pokemonImage}
        alt={name}
        sx={{
          height: 'auto',
          width: 'auto',
          maxWidth: '100%',
          maxHeight: 'calc(100% - 64px)',
          margin: '32px auto',
          objectFit: 'contain',
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
      }}>
        <Box sx={
          {
            position: 'absolute',
            bottom: -7,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1
          }
        }>
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