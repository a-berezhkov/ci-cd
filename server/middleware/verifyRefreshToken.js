const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyRefreshToken(req, res, next) {
  try {
    // Получаем refresh token из куки запроса
    // Токен передается в куки запроса в поле refreshToken
    const { refreshToken } = req.cookies;
    // Проверяем токен на валидность и извлекаем из него данные пользователя
    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Передаем данные пользователя в следующий middleware или обработчик маршрута
    // через объект res.locals (данные в res.locals доступны только в рамках текущего запроса)
    res.locals.user = user;

    next();
  } catch (error) {
    console.log("Invalid refresh token");
    res.clearCookie("refreshToken").sendStatus(401);
  }
}

module.exports = verifyRefreshToken;
