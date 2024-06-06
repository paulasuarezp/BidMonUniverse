import { model, Schema } from 'mongoose'
import { CardRarity, PokemonGym, PokemonType } from './utils/enums';

const cardSchema = new Schema(
    {
        cardId: {
            type: String, // Format: "c-<pokemonId>-n"
            required: true,
            unique: true
        },
        pokemonId:{ // Id of the pokemon (from the pokeapi)
            type: Number,
            required: true,
            unique: true,
        },
        name:{ // Name of the pokemon
            type: String, 
            unique: true,
            required: true
        },
        rarity: {
            type: String,
            enum: Object.values(CardRarity),
            required: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        cards : { // Cards of the pokemon
            type: [Schema.Types.ObjectId],
            ref: 'UserCard',
            required: true
        },
        //Pokemon data
        pokemonType: { // Type of the pokemon
            type: String,
            enum: PokemonType,
            default: PokemonType.Normal,
            required: true,
        },
        description: { // Descriptions of the pokemon
            type: [String],
            required: true
        },
        
        image: { // Image of the pokemon
            type: String,
            required: true
        },
        hp: { // HP of the pokemon
            type: Number,
            required: true
        },
        attack: { // Attack of the pokemon
            type: Number,
            required: true
        },
        defense: { // Defense of the pokemon
            type: Number,
            required: true
        },
        speed: { // Speed of the pokemon
            type: Number,
            required: true
        },
        weight: { // Weight of the pokemon
            type: Number,
            required: true
        },
        height: { // Height of the pokemon
            type: Number,
            required: true
        },
        is_legendary: { // If the pokemon is legendary
            type: Boolean,
            default: false,
            required: true
        },
        is_mythical: { // If the pokemon is mythical
            type: Boolean,
            default: false,
            required: true
        },
        n_location_area: {  // Number of locations where the pokemon can be found
            type: Number,
            required: true
        },
        n_encounters: { // Number of encounters of the pokemon
            type: Number,
            required: true
        },
        averageMaxChance: { // Average max chance of catching the pokemon
            type: Number,
            required: true
        },
        gym : { // Gym of the pokemon (it can be none if the pokemon is not the the gym leader)
            type: Object.values(PokemonGym),
            required: false,
            default: PokemonGym.None
        },

    }
)

const Card = model("Card", cardSchema);

export default Card;