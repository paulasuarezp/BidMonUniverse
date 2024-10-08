import { Avatar, Box, Card, CardContent, CardMedia, Chip } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardRarity, Card as CardType } from "../../../shared/sharedTypes";
import { capitalizeFirstLetter } from '../../../utils/utils';
import { getBackgroundImage, getCardColor, getCardGradient, getCategoryName, getCategoryStyles, getPokemonGymImg, getTypeBadge, getTypeName, typeStyles } from './CardUtils';

interface PokemonCardProps {
  card: CardType;
  userCardId: string; // Propiedad opcional para identificar la carta del usuario
  canFlip?: boolean; // Propiedad opcional para habilitar el giro
  maxSize?: boolean; // Propiedad opcional para habilitar el tamaño máximo
  type?: 'auction' | 'album' | 'bid'; // Propiedad obligatoria para determinar el tipo de tarjeta
  onClick?: () => void; // Propiedad opcional para manejar el evento de clic
  showFlipped?: boolean; // Propiedad opcional para mostrar la carta volteada
}


export default function PokemonCard({ card, userCardId, canFlip = false, maxSize = false, onClick, showFlipped }: PokemonCardProps) {
  const navigate = useNavigate();
  const [flipped, setFlipped] = useState(false);
  const [showPreviousFlipped, setShowPreviousFlipped] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (showFlipped !== undefined && showFlipped !== showPreviousFlipped) {
      setFlipped(!flipped);
      setShowPreviousFlipped(showFlipped);
    }
  }, [showFlipped]);


  let name = card?.name ? capitalizeFirstLetter(card?.name) : 'Pokemon';
  let rarity = card?.rarity || CardRarity.Common;
  let pokemonImage = card?.image || '/pokemon.png';
  let pokemonType = card?.pokemonType || 'normal';
  let pokemonGymImg = card?.gym[0] ? getPokemonGymImg(card?.gym[0]) : 'none';

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
      if (onClick) {
        onClick();
      } else {
        navigate(`/card/${userCardId}`);
      }
    }
  };
  return (
    <Card
      onClick={handleCardClick}
      role="button"
      aria-label={`Carta de ${name}`}
      aria-pressed={flipped}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleCardClick();
        }
      }}
      sx={{
        width: maxSize ? { xs: 200, sm: 200, md: 240, lg: 260, xl: 320 } : { xs: 150, sm: 150, md: 180, lg: 200, xl: 250 },
        height: maxSize ? { xs: 280, sm: 280, md: 320, lg: 340, xl: 400 } : { xs: 200, sm: 200, md: 220, lg: 240, xl: 300 },
        position: 'relative',
        color: 'white',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        cursor: 'pointer',
        '&:hover': {
          transform: !flipped ? 'scale(1.05)' : 'rotateY(180deg)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        },
        '&:focus': {
          outline: '2px solid #0046C7',
          transform: !flipped ? 'scale(1.05)' : 'rotateY(180deg)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: backgroundImageCard,
          border: border,
          borderImage: `${borderGradient} 1`,
          borderRadius: !flipped ? '10px' : '0px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {pokemonGymImg !== '' && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              right: 6,
              zIndex: 2,
            }}
          >
            <Avatar
              src={pokemonGymImg}
              alt={`Gimnasio ${card?.gym[0]}`}
              sx={{
                width: 30,
                padding: 0.2,
                height: 'auto',
                color: 'white',
                textShadow: '1px 1px 2px black',
                visibility: flipped ? 'hidden' : 'visible',
              }}
            />
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 6, left: 6, zIndex: 2 }}>
          {maxSize ? (
            <Chip
              label={typeName}
              avatar={<Avatar src={typeImg} sx={{ width: 20, height: 20 }} alt={`Tipo ${typeName}`} />}
              sx={{
                ...typeStyles[pokemonType],
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px black',
                visibility: flipped ? 'hidden' : 'visible',
              }}
            />
          ) : (
            <Avatar
              src={typeImg}
              alt={`Tipo ${typeName}`}
              sx={{
                ...typeStyles[pokemonType],
                width: 30,
                padding: 0.2,
                height: 'auto',
                color: 'white',
                textShadow: '1px 1px 2px black',
                visibility: flipped ? 'hidden' : 'visible',
              }}
            />
          )}
        </Box>

        <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
          <Chip
            label={getCategoryName(rarity)}
            sx={{
              ...getCategoryStyles(rarity),
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              textShadow: '1px 1px 2px black',
              visibility: flipped ? 'hidden' : 'visible',
            }}
          />
        </Box>
        <CardMedia
          component="img"
          image={pokemonImage}
          alt={`Imagen de ${name}`}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            margin: 'auto',
            backfaceVisibility: 'hidden',
            visibility: flipped ? 'hidden' : 'visible',
          }}
        />
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: '16px',
            paddingTop: '0px',
            '&:last-child': {
              paddingBottom: 0,
            },
            backfaceVisibility: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: -7,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          >
            <Chip
              label={name}
              sx={{
                bgcolor: `${borderColor}`,
                color: 'white',
                fontSize: '1rem',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px black',
                visibility: !flipped ? 'visible' : 'hidden',
              }}
            />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}