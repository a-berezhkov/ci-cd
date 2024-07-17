"use strict";
const bcrypt = require("bcrypt")
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        login: "admin",
        password: await bcrypt.hash("123456",10),
        email: "admin@admin.ru",
      },
      {
        login: "user",
        password: await bcrypt.hash("123456",10),
        email: "user@user.ru",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
