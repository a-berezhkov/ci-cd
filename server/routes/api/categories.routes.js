const todoRoute = require("express").Router();
const { Category } = require("../../db/models");

todoRoute.get("/:id", async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id } });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ message: "Ошибка" });
  }
});

todoRoute.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(201).json({ categories });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Category.destroy({ where: { id } });
    res.status(201).json({ categories });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Category.update(req.body, { where: { id } });
    const category = await Category.findOne({ where: { id } });
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

todoRoute.post("/", async (req, res) => {
  const { title, categoryId, userId } = req.body;
  if (!title) {
    res.status(400).json({ message: "Ошибка, не хватает данных" });
    return;
  }
  if (title.trim() === "") {
    res.status(400).json({ message: "Ошибка, одно из полей пустые" });
    return;
  }
  req.body.title = req.body.title.trim();
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ category });
  } catch (error) {
    res.status(500).json({ error, message: "Ошибка" });
  }
});

module.exports = todoRoute;
