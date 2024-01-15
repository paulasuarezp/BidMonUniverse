import { model, Schema } from 'mongoose'

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profileImg: {
            type: String,
            required: false
        },
        birthday: {
            type: String,
            required: false
        },
        role: {
            type: String,
            default: "standard",
            required: false
        },
    }
)


const User = model("User", userSchema);

export default User;