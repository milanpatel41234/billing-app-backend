const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Company = sequelize.define("company", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    website: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logo: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_logo: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    upi: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    sign: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_sign: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    gst: {
      type: DataTypes.STRING,
      defaultValue: null,
    },

    pan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    common_seal: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_common_seal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ip: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  });

  return Company;
};
