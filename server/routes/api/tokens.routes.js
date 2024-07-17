const cookiesConfig = require("../../config/cookiesConfig");
const verifyRefreshToken = require("../../middleware/verifyRefreshToken");
const generateTokens = require("../../utils/generateTokens");

const router = require("express").Router();

// Обновление токена доступа и отправка нового токена доступа и данных пользователя
// verifyRefreshToken - проверяет наличие токена обновления и его валидность
router.get("/refresh", verifyRefreshToken, async (req, res) => {
  const { accessToken, refreshToken } = generateTokens({
    user: res.locals.user,
  });
  res
    .cookie("refreshToken", refreshToken, cookiesConfig)
    .json({ accessToken, user: res.locals.user });
});

module.exports = router;
