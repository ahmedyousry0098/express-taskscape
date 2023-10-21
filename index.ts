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

app.use(cors<Request>({
    origin: "*",
    methods: "*",
    credentials: false
}))
app.options('*', cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any domain
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
  

app.use(express.urlencoded({extended: false}))
app.use(express.json())


connectDB()

app.use('/organization', organizationRoutes)
app.use('/admin', adminRoutes)

app.all('*', (req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({message: 'page not found'})
})

app.use(globalErrorHandler)

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})