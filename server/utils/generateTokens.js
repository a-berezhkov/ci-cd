require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

function generateTokens(payload) { // payload - это объект с данными пользователя
    return {
      // Создаем токен доступа и токен обновления
      // payload - это объект с данными пользователя
      // process.env.ACCESS_TOKEN_SECRET - это секретный ключ для токена доступа
      // process.env.REFRESH_TOKEN_SECRET - это секретный ключ для токена обновления
      // jwtConfig.access - это объект с настройками для токена доступа  (время жизни токена и тип токена)
      accessToken: jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, jwtConfig.access),
      refreshToken: jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, jwtConfig.refresh),
    };
  }

module.exports = generateTokens;
  