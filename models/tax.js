const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const tax = sequelize.define('tax', {
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(45),
      defaultValue: null,
    },
    
  });

  return tax;
};
