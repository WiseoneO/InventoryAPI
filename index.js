import express, {json} from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

import connectDatabase from './src/config/database.js';
import itemRouter from './src/api/routes/item.routes.js';
import userRouter from './src/api/routes/user.route.js';

connectDatabase(app);

app.use(json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res)=>{
    res.send('<h1>Inventory Api</h1>')
});
console.log('waiting for database');

app.use('/api/inventory', itemRouter);
app.use('/api/inventory', userRouter);