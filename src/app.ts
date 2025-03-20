import 'dotenv/config';
import express, { Request, Response } from 'express';
import furnitureRoutes from './routes/furnitureRoutes'

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(furnitureRoutes)

app.get('/', (req: Request, res: Response) => {
  res.send('Да нахер этот диплом!');
});

app.get('*', (req: Request, res: Response) => {
  res.status(404).send('No resource found');
});

export default app;