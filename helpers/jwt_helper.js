import JWT from 'jsonwebtoken';
import createError from 'http-errors';
import UserToken from '../Models/UserToken.model.js';

export const signAccessToken = (userId) => {
  console.log('in here');
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: '1h',
      issuer: 'salasar-group.com',
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

export const verifyAccessToken = (req, res, next) => {
  if (!req.headers['authorization']) return next(createError.Unauthorized());
  const authHeader = req.headers['authorization'];
  console.log('in here', req.headers['authorization']);
  const bearerToken = authHeader.split(' ');
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

export const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: '1y',
      issuer: 'salasar-group.com',
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

export const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) return reject(createError.Unauthorized());
      const userId = payload.aud;
      const token = String(refreshToken);
      UserToken.findOne({ token: token }, (err, doc) => {
        if (err) {
          console.log('err.message', err.message);
          reject(createError.Unauthorized());
        }
        if (doc) {
          if (refreshToken === doc.token) return resolve(userId);
          reject(createError.Unauthorized());
        }
        reject(createError.Unauthorized());
      });
    });
  });
};
