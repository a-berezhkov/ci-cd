const removeHeaders = (req, res, next) => {
  res.removeHeader("X-Powered-By");
  // Удаление заголовка `X-Powered-By`
  next();
  // Переход к следующему middleware или обработчику маршрута
};

module.exports = removeHeaders
