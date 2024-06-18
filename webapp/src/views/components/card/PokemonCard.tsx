import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Box, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { CardRarity, Card as CardType, PokemonGym } from "../../../shared/sharedTypes";
import { capitalizeFirstLetter } from '../../../utils/utils';
import { getCategoryName, getCategoryStyles, getCardColor, getCardGradient, getBackgroundImage, getTypeBadge, getTypeName, getPokemonGymImg, typeStyles } from './CardUtils';

interface PokemonCardProps {
  card: CardType;
  canFlip?: boolean; // Propiedad opcional para habilitar el giro
  maxSize?: boolean; // Propiedad opcional para habilitar el tamaño máximo
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
        {maxSize &&
          <Chip label={typeName}
            avatar={<Avatar src={typeImg} sx={{ width: 20, height: 20 }} alt={typeName} />}
            sx={{
              ...typeStyles[pokemonType],
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px black',
              visibility: flipped ? 'hidden' : 'visible'
            }}
          />
        }
        {!maxSize &&
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
        }
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