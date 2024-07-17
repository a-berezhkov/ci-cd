const jwt = require("jsonwebtoken");
require("dotenv").config();

function verifyAccessToken(req, res, next) {
  try {
    //Получаем токен из заголовка запроса
    // токен передается в заголовке запроса в поле Authorization вида "Bearer токен"
    const accessToken = req.headers.authorization.split(" ")[1];
    // Проверяем токен на валидность и извлекаем из него данные пользователя
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    // Передаем данные пользователя в следующий middleware или обработчик маршрута
    // через объект res.locals (данные в res.locals доступны только в рамках текущего запроса)
    // После завершения запроса данные удаляются из res.locals
    res.locals.user = user;

    next();
  } catch (error) {
    console.log("Invalid access token");
    res.status(403).send("Invalid access token");
  }
}

module.exports = verifyAccessToken;
