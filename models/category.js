const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
    },
    active : {
      type: DataTypes.BOOLEAN,
    },
    description: {
      type: DataTypes.STRING(45),
      defaultValue: null,
    },
  },);

  return category;
};
