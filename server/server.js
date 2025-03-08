import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js';

//initialize express
const app = express();

//connect DB
await connectDB();

//middlewares
app.use(cors())
app.use(express.json())


//routes
app.get('/', (req, res) => res.send('API working...'))


//PORT
const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`server running on port:${PORT}`);
})