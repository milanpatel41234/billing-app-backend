module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: Sequelize.STRING, allowNull: false },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: { type: Sequelize.STRING, allowNull: false },
  });

  return user;
};
