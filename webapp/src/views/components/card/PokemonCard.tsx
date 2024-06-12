import { Box, Card, CardContent, CardMedia, Chip } from "@mui/material";

interface PokemonCardProps {
  name: string;
  category: 'Common' | 'Rare' | 'Ultra Rare' | 'Legendary' | 'Mythical';
  backgroundImage: string;
  pokemonImage: string;
}

function getCategoryStyles(category: PokemonCardProps['category']) {
  switch (category) {
    case 'Common':
      return { backgroundColor: 'grey' };
    case 'Rare':
      return { backgroundColor: 'blue' };
    case 'Ultra Rare':
      return { backgroundColor: 'purple' };
    case 'Legendary':
      return { backgroundColor: 'gold' };
    case 'Mythical':
      return { backgroundColor: 'red' };
    default:
      return {};
  }
}


export default function PokemonCard({ name, category, backgroundImage, pokemonImage }: PokemonCardProps) {
  return (
    <Card sx={{
      maxWidth: 200,
      borderRadius: '10px',
      background: `url(${backgroundImage}) center / cover no-repeat, #000`,
      border: '10px solid #000',
      position: 'relative',
      color: 'white',
      overflow: 'visible',
    }}>
      <Box sx={{
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90px',
        height: '80px',
        backgroundImage: `url(/borde.png)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }} />
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1 }}>
        <Chip label={category}
          sx={{
            ...getCategoryStyles(category),
            color: 'white',
          }} />
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
        <Chip label={name} sx={{
          position: 'absolute',
          bottom: -7,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'black',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
        }} />
      </CardContent>
    </Card>
  );
};