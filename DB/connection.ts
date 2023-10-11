import mongoose from "mongoose";

export function connectDB () {
    mongoose.connect(`${process.env.DB_CONNECTION_LINK}`)
        .then(() => console.log(`DB Connected`))
        .catch(err => console.error(err))
}