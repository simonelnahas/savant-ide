import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Handler, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import lusca from 'lusca';
import path from 'path';
import { check, run } from './handlers';

const app = express();
const wrapAsync = (fn: Handler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// create temp folder if it doesn't exist
const temp = path.join(process.cwd(), 'temp');

if (!fs.existsSync(temp)) {
  fs.mkdirSync(temp);
}

// configure express
app.set('port', process.env.PORT || 8080);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

app.post('/contract/check', wrapAsync(check));
app.post('/contract/call', wrapAsync(run));

export default app;
