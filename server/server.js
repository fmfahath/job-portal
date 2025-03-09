import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node"
import { clerkWebhooks } from './controllers/userController.js';

//initialize express
const app = express();

//connect DB
await connectDB();

//middlewares
app.use(cors())
app.use(express.json())


//routes
app.get('/', (req, res) => res.send('API working...'))
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
});
app.post('/webhooks', clerkWebhooks)


//PORT
const PORT = process.env.PORT || 4000

//sentry
Sentry.setupExpressErrorHandler(app);

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`);
})