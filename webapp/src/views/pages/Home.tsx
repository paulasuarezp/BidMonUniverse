import { CardMedia, Grid, Typography } from '@mui/material';
import Button from '../components/buttons/Button';
import PokemonCard from '../components/card/PokemonCard';
import Container from '../components/container/Container';


//#region COMPONENTE HOME
export default function Home() {
  return (
    <Container>
      {/* Hero Section */}
      <Grid container spacing={4} alignItems="center" style={{ marginTop: '20px' }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h2" component="h1">
            ¡Bienvenido a BidMonUniverse, la mejor plataforma de subastas de cartas Pokémon!
          </Typography>
          <Typography variant="h5" component="h2" style={{ marginTop: '20px' }}>
            Descubre, colecciona y subasta las cartas más valiosas.
          </Typography>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }} label='Regístrate ahora' />
        </Grid>
        <Grid item xs={12} md={6}>
          <CardMedia
            component="img"
            image="/logo-sf.png"
            alt="BidMon Universe"
          />
        </Grid>
      </Grid>

      {/* Galería de Cartas Populares */}
      <Typography variant="h4" component="h2" style={{ marginTop: '40px' }}>
        Cartas Populares
      </Typography>
      <Grid container spacing={4} style={{ marginTop: '20px' }}>
        {/* Reemplaza con datos reales */}
        {cleanMongoProperties(popularCards).map((card) => (
          <Grid item xs={12} sm={6} md={4} key={card._id}>
            <PokemonCard card={card} userCardId='1' onClick={() => { }} />
          </Grid>
        ))}
      </Grid>


    </Container>
  );

};
//#endregion
// Ejemplo de datos ficticios

const popularCards = [
  { "_id": "6661e0331e0b158d0f0cdb27", "cardId": "c-9-8", "pokemonId": "9", "name": "blastoise", "rarity": "legendary", "releaseDate": { "$date": { "$numberLong": "1717690032000" } }, "availableQuantity": { "$numberInt": "100" }, "cards": [], "pokemonType": "water", "description": ["Para acabar con su enemigo, lo aplasta con el peso de su cuerpo. En momentos de apuro, se esconde en el caparazón.@NEWDESCRIPTION@Es un Pokémon imponente. Tiene reactores de agua en el caparazón, que le sirven para atacar con fuerza.@NEWDESCRIPTION@Blastoise lanza chorros de agua con gran precisión por los tubos que le salen del caparazón que tiene en la espalda. Puede disparar chorros de agua con tanta puntería que no fallaría al tirar contra una lata pequeña a 50 m.@NEWDESCRIPTION@Blastoise lanza chorros de agua con gran precisión por los tubos que le salen del caparazón que tiene en la espalda. Puede disparar chorros de agua con tanta puntería que no fallaría al tirar contra una lata pequeña a 50 m.@NEWDESCRIPTION@Tras fijar el blanco, ataca disparando un chorro de agua a una presión mayor que la manguera de un bombero.@NEWDESCRIPTION@Tras fijar el blanco, ataca disparando un chorro de agua a una presión mayor que la manguera de un bombero.@NEWDESCRIPTION@Para acabar con su enemigo, lo aplasta con el peso de su cuerpo. En momentos de apuro, se esconde en el caparazón.@NEWDESCRIPTION@Dispara chorros de agua a través de los cañones de su caparazón, capaces de agujerear incluso el acero."], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/9.svg", "hp": { "$numberInt": "79" }, "attack": { "$numberInt": "83" }, "defense": { "$numberInt": "100" }, "speed": { "$numberInt": "78" }, "weight": { "$numberInt": "855" }, "height": { "$numberInt": "16" }, "is_legendary": false, "is_mythical": false, "n_location_area": { "$numberInt": "0" }, "n_encounters": { "$numberInt": "0" }, "averageMaxChance": { "$numberInt": "0" }, "gym": ["none"] },
  { "_id": "6661e0331e0b158d0f0cdb37", "cardId": "c-25-24", "pokemonId": "25", "name": "pikachu", "rarity": "legendary", "releaseDate": { "$date": { "$numberLong": "1717690042000" } }, "availableQuantity": { "$numberInt": "100" }, "cards": [], "pokemonType": "electric", "description": ["Levanta su cola para vigilar los alrededores. A veces, puede ser alcanzado por un rayo en esa pose.@NEWDESCRIPTION@Las bolsas de las mejillas están llenas de electricidad, que libera cuando se siente amenazado.@NEWDESCRIPTION@Cada vez que un Pikachu se encuentra con algo nuevo, le lanza una descarga eléctrica. Cuando se ve alguna baya chamuscada, es muy probable que sea obra de un Pikachu, ya que a veces no controlan la intensidad de la descarga.@NEWDESCRIPTION@Este Pokémon tiene unas bolsas en las mejillas donde almacena electricidad. Parece ser que se recargan por la noche, mientras Pikachu duerme. A veces, cuando se acaba de despertar y está aún medio dormido, descarga un poco.@NEWDESCRIPTION@Recientemente se ha presentado un proyecto para reunir numerosos Pikachu y crear con ellos una central eléctrica.@NEWDESCRIPTION@Pikachu almacena electricidad en su cuerpo. Si no la libera de vez en cuando y se desfoga, puede sufrir estrés.@NEWDESCRIPTION@Acumulan electricidad de forma natural. Los bosques donde habitan en grupos están en peligro constante de ser alcanzados por rayos.@NEWDESCRIPTION@Mientras duerme, acumula electricidad en las bolsas de sus mejillas. Si no logra conciliar el sueño, solo puede emitir débiles descargas.@NEWDESCRIPTION@Los bosques son su hábitat natural. En las bolsas de las mejillas acumula electricidad, por lo que quien las toque puede recibir una descarga.@NEWDESCRIPTION@Los bosques son su hábitat natural. En las bolsas de las mejillas acumula electricidad, por lo que quien las toque puede recibir una descarga.@NEWDESCRIPTION@Cuanto más potente es la energía eléctrica que genera este Pokémon, más suaves y elásticas se vuelven las bolsas de sus mejillas.@NEWDESCRIPTION@Los miembros de esta especie se saludan entre sí uniendo sus colas y transmitiéndose corriente eléctrica."], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg", "hp": { "$numberInt": "35" }, "attack": { "$numberInt": "55" }, "defense": { "$numberInt": "40" }, "speed": { "$numberInt": "90" }, "weight": { "$numberInt": "60" }, "height": { "$numberInt": "4" }, "is_legendary": false, "is_mythical": false, "n_location_area": { "$numberInt": "17" }, "n_encounters": { "$numberInt": "43" }, "averageMaxChance": { "$numberDouble": "33.627906976744185" }, "gym": ["none"] },
  { "_id": "6661e0331e0b158d0f0cdbb5", "cardId": "c-151-150", "pokemonId": "151", "name": "mew", "rarity": "common", "releaseDate": { "$date": { "$numberLong": "1717690115000" } }, "availableQuantity": { "$numberInt": "100" }, "cards": [], "pokemonType": "psychic", "description": ["Varios científicos lo consideran el antecesor de los Pokémon porque usa todo tipo de movimientos.@NEWDESCRIPTION@Dicen que su ADN contiene el código genético de todos los Pokémon, por lo que conoce cualquier técnica.@NEWDESCRIPTION@Dicen que Mew posee el mapa genético de todos los Pokémon. Puede hacerse invisible cuando quiere, así que pasa desapercibido cada vez que se le acerca alguien.@NEWDESCRIPTION@Dicen que Mew posee el mapa genético de todos los Pokémon. Puede hacerse invisible cuando quiere, así que pasa desapercibido cada vez que se le acerca alguien.@NEWDESCRIPTION@Si se observa a través de un microscopio, puede distinguirse cuán corto, fino y delicado es el pelaje de este Pokémon.@NEWDESCRIPTION@Si se observa a través de un microscopio, puede distinguirse cuán corto, fino y delicado es el pelaje de este Pokémon."], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/151.svg", "hp": { "$numberInt": "100" }, "attack": { "$numberInt": "100" }, "defense": { "$numberInt": "100" }, "speed": { "$numberInt": "100" }, "weight": { "$numberInt": "40" }, "height": { "$numberInt": "4" }, "is_legendary": false, "is_mythical": true, "n_location_area": { "$numberInt": "1" }, "n_encounters": { "$numberInt": "1" }, "averageMaxChance": { "$numberInt": "100" }, "gym": ["none"] },
  { "_id": "6661e0331e0b158d0f0cdb2a", "cardId": "c-12-11", "pokemonId": "12", "name": "butterfree", "rarity": "rare", "releaseDate": { "$date": { "$numberLong": "1717690035000" } }, "availableQuantity": { "$numberInt": "99" }, "cards": [{ "$oid": "66785d5929373e7341a71350" }], "pokemonType": "bug", "description": ["Adora el néctar de las flores. Puede localizar hasta las más pequeñas cantidades de polen.@NEWDESCRIPTION@Tiene las alas protegidas con una capa impermeable, de ahí que pueda volar también cuando llueve.@NEWDESCRIPTION@Butterfree tiene una habilidad especial para encontrar delicioso polen en las flores. Puede localizar, extraer y transportar polen de flores que estén floreciendo a 10 km de distancia de su nido.@NEWDESCRIPTION@Butterfree tiene una habilidad especial para encontrar delicioso polen en las flores. Puede localizar, extraer y transportar polen de flores que estén floreciendo a 10 km de distancia de su nido.@NEWDESCRIPTION@Al mirar sus grandes ojos desde cerca, puede observarse como en realidad están compuestos de incontables ojos diminutos.@NEWDESCRIPTION@Cuando lo atacan, Butterfree aletea con fuerza y esparce escamas venenosas con las que hace frente a su adversario.@NEWDESCRIPTION@Si un Pokémon pájaro acecha a un Caterpie, Butterfree esparcirá las escamas venenosas que recubren sus alas para ahuyentarlo.@NEWDESCRIPTION@Adora el néctar de las flores más bellas. Libra feroces disputas territoriales en los prados con los Cutiefly.@NEWDESCRIPTION@Sus alas están recubiertas de escamas venenosas impermeables que le permiten volar bajo la lluvia.@NEWDESCRIPTION@Sus alas están recubiertas de escamas venenosas impermeables que le permiten volar bajo la lluvia.@NEWDESCRIPTION@Aletea a gran velocidad para lanzar al aire sus escamas extremadamente tóxicas.@NEWDESCRIPTION@Recoge néctar a diario y se lo adhiere al pelo de las patas para llevarlo a su nido."], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/12.svg", "hp": { "$numberInt": "60" }, "attack": { "$numberInt": "45" }, "defense": { "$numberInt": "50" }, "speed": { "$numberInt": "70" }, "weight": { "$numberInt": "320" }, "height": { "$numberInt": "11" }, "is_legendary": false, "is_mythical": false, "n_location_area": { "$numberInt": "22" }, "n_encounters": { "$numberInt": "36" }, "averageMaxChance": { "$numberDouble": "18.555555555555557" }, "gym": ["none"], },
  { "_id": "6661e0331e0b158d0f0cdb22", "cardId": "c-4-3", "pokemonId": "4", "name": "charmander", "rarity": "ultrarare", "releaseDate": { "$date": { "$numberLong": "1717690029000" } }, "availableQuantity": { "$numberInt": "99" }, "cards": [{ "$oid": "66643dcc6c136e392adc40f2" }], "pokemonType": "fire", "description": ["La llama de su cola indica la fuerza vital de Charmander. Será brillante si está sano.@NEWDESCRIPTION@Este Pokémon nace con una llama en la punta de la cola. Si la llama se apagara, el Pokémon se debilitaría.@NEWDESCRIPTION@La llama que tiene en la punta de la cola arde según sus sentimientos. Llamea levemente cuando está alegre y arde vigorosamente cuando está enfadado.@NEWDESCRIPTION@La llama que tiene en la punta de la cola arde según sus sentimientos. Llamea levemente cuando está alegre y arde vigorosamente cuando está enfadado.@NEWDESCRIPTION@En lugares silenciosos se puede oír el débil chisporroteo de la llama que le arde en la punta de la cola.@NEWDESCRIPTION@En lugares silenciosos se puede oír el débil chisporroteo de la llama que le arde en la punta de la cola.@NEWDESCRIPTION@Prefiere las cosas calientes. Dicen que cuando llueve le sale vapor de la punta de la cola.@NEWDESCRIPTION@Este Pokémon nace con una llama en la punta de la cola. Si se le apagara, fallecería."], "image": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/4.svg", "hp": { "$numberInt": "39" }, "attack": { "$numberInt": "52" }, "defense": { "$numberInt": "43" }, "speed": { "$numberInt": "65" }, "weight": { "$numberInt": "85" }, "height": { "$numberInt": "6" }, "is_legendary": false, "is_mythical": false, "n_location_area": { "$numberInt": "4" }, "n_encounters": { "$numberInt": "11" }, "averageMaxChance": { "$numberInt": "100" }, "gym": ["none"] }
];

function cleanMongoProperties(cards) {
  return cards.map(card => {
    let cleanCard = {};
    for (let key in card) {
      if (typeof card[key] === 'object' && card[key] !== null) {
        if (card[key].$numberLong) {
          cleanCard[key] = parseInt(card[key].$numberLong);
        } else if (card[key].$numberInt) {
          cleanCard[key] = parseInt(card[key].$numberInt);
        } else if (card[key].$numberDouble) {
          cleanCard[key] = parseFloat(card[key].$numberDouble);
        } else if (card[key].$date && card[key].$date.$numberLong) {
          cleanCard[key] = new Date(parseInt(card[key].$date.$numberLong));
        } else if (card[key].$oid) {
          cleanCard[key] = card[key].$oid;
        } else {
          cleanCard[key] = card[key];
        }
      } else {
        cleanCard[key] = card[key];
      }
    }
    return cleanCard;
  });
}

