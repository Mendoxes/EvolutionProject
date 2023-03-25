import express, { Request, Response } from 'express';
import cors from 'cors';
// import { createGame} from './serverComponents/game';
import { apiRouter } from './serverComponents/api';

const app = express();

app.use(cors());
app.use(express.json());

// export const apiRouter = express.Router();

// apiRouter.post('/game', createGame);


app.use('/api', apiRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// narazie do uruchomienia trzeba użyć komendy:
// node --loader ts-node/esm ./src/server.tsz
//node --loader ts-node/esm --experimental-specifier-resolution=node /.server.ts