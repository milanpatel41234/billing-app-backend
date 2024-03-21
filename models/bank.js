const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Bank = sequelize.define('bank', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    ifsc: {
      type: DataTypes.STRING(20), 
      allowNull: false,
      unique: true,
    },
    branch: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    account_no: {
      type: DataTypes.STRING(20), 
      allowNull: false,
      unique: true,
    },
    discription: {
      type: DataTypes.STRING(255),
    },
  });

  return Bank;
};
