const indexRoute = require("express").Router();

const todoRoute = require("./api/todos.routes");
const authRoute = require("./api/auth.routes");
const categoryRoute = require("./api/categories.routes");
const tokensRoute = require("./api/tokens.routes");

indexRoute.use("/todos", todoRoute);
indexRoute.use("/auth", authRoute);
indexRoute.use("/categories", categoryRoute);
indexRoute.use("/tokens", tokensRoute);

module.exports = indexRoute;
