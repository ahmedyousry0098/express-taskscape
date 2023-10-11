import express from 'express'
import { connectDB } from './DB/connection'
import { globalErrorHandler } from './src/utils/errHandling'
import { config } from 'dotenv'
import cors from 'cors'
config({path: './.env'})

const app = express()
const port = process.env.PORT

app.use(cors({
    origin: '*'
}))

app.use(express.json())

connectDB()

app.use(globalErrorHandler)

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})