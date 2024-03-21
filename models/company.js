const { DataTypes } = require('sequelize');

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
    tin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gst: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    service_tax: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    pan: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dl_no: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    cin_no: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    additional_detail: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    running_out_limit: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    purchase_inv_prefix: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    sales_inv_prefix: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    quotation_prefix: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    bussiness_type: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    common_seal: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_common_seal: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    financial_year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    e_commerce_gst: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    is_bank_detail: {
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
