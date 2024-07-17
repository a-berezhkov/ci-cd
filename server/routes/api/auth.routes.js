const authRoute = require("express").Router();
const { User } = require("../../db/models");
const bcrypt = require("bcrypt");
const generateTokens = require("./../../utils/generateTokens");
const jwt = require("jsonwebtoken");
const cookiesConfig = require("../../config/cookiesConfig");
 
/**
 * Роут на создание нового пользователя
 * В ответе отдает json
 */
authRoute.post("/registration", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Не все поля" });
    return;
  }

  if (email.trim() === "" || password.trim() === "") {
    res.status(400).json({ message: "Поля не пустые" });
    return;
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ ...req.body, password: hashPassword });
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка сервера" });
  }
});

authRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.status(400).json({ message: "Не все поля" });
    return;
  }

  if (email.trim() === "" || password.trim() === "") {
    res.status(400).json({ message: "Поля не пустые" });
    return;
  }

  try {
    const targetUser = await User.findOne({
      where: {
        email,
      },
    });
    if (!targetUser)
      return res.status(401).json({ message: "Неверный email или пароль" });

    const IsValidPassword = bcrypt.compare(password, targetUser.password);
    if (!IsValidPassword) {
      res
        .status(401)
        .json({ error, message: "Не правильный пароль или логин" });
      return;
    }
    const user = targetUser.get(); // Получаем объект пользователя из базы данных
    delete user.password; // Удаляем поле password из объекта пользователя

    // Генерируем токены для пользователя

    const { accessToken, refreshToken } = generateTokens({ user });

    res
      .cookie("refreshToken", refreshToken, cookiesConfig) // Отправляем refresh token в куки
      .json({ accessToken, user }); // Отправляем токен доступа и данные пользователя
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Нет пользователя" });
  }
});

authRoute.get("/logout", async (req, res) => {
  res.clearCookie("refreshToken").json({ message: "OK" });
});
module.exports = authRoute;
