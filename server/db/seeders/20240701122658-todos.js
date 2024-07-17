"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Todos", [
      {
        title: "Выучить JS",
        isDone: false,
        categoryId: 1,
        userId: 1,
      },
      {
        title: "Разобраться с Express",
        isDone: false,
        categoryId: 1,
        userId: 1,
      },
      {
        title: "Починить React",
        isDone: false,
        categoryId: 1,
        userId: 1,
      },
      {
        title: "Защитить проект",
        isDone: false,
        categoryId: 1,
        userId: 1,
      },
      {
        title: "Сходить в магазин",
        isDone: false,
        categoryId: 2,
        userId: 1,
      },
      {
        title: "Помыть посуду",
        isDone: false,
        categoryId: 2,
        userId: 1,
      },
      {
        title: "Погулять",
        isDone: false,
        categoryId: 2,
        userId: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Todos", null, {});
  },
};
