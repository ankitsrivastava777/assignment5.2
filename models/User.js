const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

var user = sequelize.define(
  "users",
  {
    username: {
      type: Sequelize.STRING,
      field: "username_name",
    },
    lastname: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      field: "user_email",
    },
    password: {
      type: Sequelize.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

exports.user = user;
