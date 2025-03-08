import express from 'express'
import cors from 'cors'
import 'dotenv/config'

//initialize express
const app = express();

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