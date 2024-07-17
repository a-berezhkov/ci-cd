const express = require("express");
const path = require("path");
const app = express(); // Создаем экземпляр приложения
const morgan = require("morgan");
const removeHeader = require("./middleware/removeHeaders");
const cookieParser = require("cookie-parser");

// Импортируем роуты из отдельных файлов

const indexRoute = require("./routes/index.api.routes");

app.use(cookieParser());
app.use(morgan("dev")); // Логирование запросов на сервере
app.use(express.urlencoded({ extended: true })); // для чтения из POST запросов
app.use(express.json()); // для чтения json из body
const cors = require('cors');
app.use(express.static(path.join(__dirname, "public")));
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true, // if you need to allow cookies
    })
  );
  app.use(express.static(path.join(__dirname, "../client/dist")));
} else {
 
  app.use(express.static(path.join(__dirname, "public/dist")));
}

// app.use(removeHeader);

app.use("/api", indexRoute);
app.get("*", (req, res) => {
  let pathToReactFiles;
  if (process.env.NODE_ENV === "production") {
    pathToReactFiles = "public/dist/index.html";
    res.sendFile(path.join(__dirname, pathToReactFiles));
  }
});

const PORT =
  process.env.NODE_ENV === "production"
    ? process.env.PORT_PROD
    : process.env.PORT_DEV;
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
