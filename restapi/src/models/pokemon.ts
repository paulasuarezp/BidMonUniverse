import { model, Schema } from 'mongoose'
import { PokemonGym, PokemonType } from './utils/enums'

const pokemonSchema = new Schema(
    {
        pokemonId:{
            type: Number,
            required: true
        },
        name:{
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: PokemonType,
            default: PokemonType.Normal,
            required: true,
        },
        description: {
            type: [String],
            required: true
        },
        image: {
            type: String,
            required: true
        },
        hp: {
            type: Number,
            required: true
        },
        attack: {
            type: Number,
            required: true
        },
        defense: {
            type: Number,
            required: true
        },
        specialAttack: {
            type: Number,
            required: true
        },
        specialDefense: {
            type: Number,
            required: true
        },
        speed: {
            type: Number,
            required: true
        },
        weight: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        },
        is_legendary: {
            type: Boolean,
            default: false,
            required: true
        },
        is_mythical: {
            type: Boolean,
            default: false,
            required: true
        },
        n_locationsArea: { 
            type: Number,
            required: true
        },
        n_encounters: {
            type: Number,
            required: true
        },
        gym : {
            type: PokemonGym,
            required: false,
            default: PokemonGym.None
        }
    }
)

const Pokemon = model("Pokemon", pokemonSchema);

export default Pokemon;