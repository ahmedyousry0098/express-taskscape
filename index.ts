process.on('uncaughtException', (err) => {
    console.error(err)
})

import express, { NextFunction, Request, Response } from 'express'
import { connectDB } from './DB/connection'
import { globalErrorHandler } from './src/utils/errHandling'
import organizationRoutes from './src/module/organization/organization.routes'
import adminRoutes from './src/module/admin/admin.routes'
import { config } from 'dotenv'
import cors from 'cors'
config({path: './.env'})

const app = express()
const port = process.env.PORT

app.use(cors({
    origin: "*",
    maxAge: 600
}))

app.use(express.urlencoded({extended: false}))
app.use(express.json())

connectDB()

app.use('/organization', organizationRoutes)
app.use('/admin', adminRoutes)
app.use(globalErrorHandler)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({message: 'page not found'})
})

process.on('unhandledRejection', (err) => {
    console.error(`${err}`)
})

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})