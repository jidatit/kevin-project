import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import tokensRouter from './routes/tokens.mjs';

config();

const app = express();
const port = 10000;

app.use(cors());
app.use(express.json());
app.use('/api', tokensRouter);

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});