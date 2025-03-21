import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node"
import comapnyRouter from './routes/comapnyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoute from './routes/jobsRoute.js'
import { clerkWebhooks } from './controllers/webhookController.js';
import usersRouter from './routes/usersRoutes.js';
import { clerkMiddleware } from '@clerk/express'


//initialize express
const app = express();

//connect DB
await connectDB();
await connectCloudinary();

//middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//routes
app.get('/', (req, res) => res.send('API working...'))
app.post('/webhooks', clerkWebhooks)
app.use('/api/company', comapnyRouter)
app.use('/api/jobs', jobRoute)
app.use('/api/users', usersRouter)
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});


//PORT
const PORT = process.env.PORT || 4000

//sentry
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`);
})