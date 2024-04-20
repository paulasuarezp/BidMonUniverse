import React from 'react';
import ButtonPrincipal from '../components/button/principal/ButtonPrincipal';
import PokemonCard from '../components/card/PokemonCard';

//#region COMPONENTE LOGIN
export default function Login() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', margin: '10em' }}>
    <PokemonCard name="Prueba" category='Common' backgroundImage='/selva.avif' pokemonImage='/2.svg'/>
    <ButtonPrincipal label="Inicia sesión o regístrate" />
    </div>
  );
};
//#endregion
