import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import Routes from './routes';

dotenv.config();

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(
  session({
    secret: 'abc123',
    resave: true,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.currentUser;
  next();
});

app.use(express.json());

app.use('/', Routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, _ => console.log(`Listening on port ${PORT}`));
