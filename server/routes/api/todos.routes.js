const todoRoute = require("express").Router();
const { Todo } = require("../../db/models");
const removeHeader = require("../../middleware/removeHeaders");
const verifyAccessToken = require("../../middleware/verifyAccessToken");
todoRoute.get("/:id", removeHeader, async (req, res) => {
  try {
    const todo = await Todo.findOne({ where: { id: req.params.id } });
    res.status(200).json({ todo });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({
      order: [["id", "ASC"]],
    });
    res.status(200).json({ todos });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.destroy({ where: { id } });
    res.status(200).json({ todo });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.update(req.body, { where: { id } });
    res.status(200).json({ todo });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.post("/", verifyAccessToken, async (req, res) => {
  const userId = res.locals.user.id;
  const { title, categoryId } = req.body;

  if (!title || !categoryId || !userId) {
    res.status(400).json({ message: "Ошибка, не хватает данных" });
    return;
  }
  if (title.trim() === "" || categoryId.trim() === "") {
    res.status(400).json({ message: "Ошибка, одно из полей пустые" });
    return;
  }

  try {
    const todo = await Todo.create({ ...req.body, userId });
    res.status(201).json({ todo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Ошибка" });
  }
});

module.exports = todoRoute;
