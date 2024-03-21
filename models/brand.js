const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const brand = sequelize.define('brand', {
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

  return brand;
};
