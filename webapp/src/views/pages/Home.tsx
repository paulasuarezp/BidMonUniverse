import React from 'react';
import ButtonPrincipal from '../components/button/principal/ButtonPrincipal';
import PokemonCard from '../components/card/PokemonCard';

//#region COMPONENTE LOGIN
export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
    <PokemonCard name="Prueba" category='Common' backgroundImage='/selva.avif' pokemonImage='/2.svg'/>
    </div>
  );
};
//#endregion
