import express from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import dotenv from 'dotenv';
import { verifyAccessToken } from './helpers/jwt_helper.js';
import initMongoDB from './helpers/init_mongodb.js';
// import initRedis from './helpers/init_redis.js';
import AuthRoute from './Routes/Auth.route.js';
import UserRoute from './Routes/User.route.js';
import PropertyRoute from './Routes/Property.route.js'
import ExperienceRoute from './Routes/Experience.route.js'
import ConveyanceRoute from './Routes/Conveyance.route.js'
import BookingRoute from './Routes/Booking.route.js'
import https from 'https'


import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
initMongoDB();
// initRedis();

const app = express();
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.furutcamps.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.furutcamps.com/fullchain.pem')
};
global.__basedir = __dirname;
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', verifyAccessToken, async (req, res, next) => {
//   res.send('Hello from express.');
// });
app.get('/', async (req, res, next) => {
  res.send('Hello from express.');
});

app.use('/auth', AuthRoute);
app.use('/user', UserRoute)
app.use('/property', PropertyRoute)
app.use('/experience', ExperienceRoute)
app.use('/conveyance', ConveyanceRoute)
app.use('/booking', BookingRoute)

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });

});

const PORT = process.env.PORT || 3000;

/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

https.createServer(options, app).listen(4014, () => {
  console.log('Server is running on https://api.furutcamps.com:4014/');
});