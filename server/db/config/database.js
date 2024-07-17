require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },
  docker: {
    username: process.env.DOCKER_DB_USER,
    password: process.env.DOCKER_DB_PASSWORD,
    database: process.env.DOCKER_DB_NAME,
    host: process.env.DOCKER_DB_HOST,
    dialect: process.env.DOCKER_DB_DIALECT
  },
  production: {
    username: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PROD,
    dialect: process.env.DB_DIALECT_PROD
  }
};