const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const quotation = sequelize.define("quotation", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    fy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true,
    },
    quotation: {
      type: DataTypes.INTEGER,
      required:true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      required: true,
    },
    invoiced: {
      type: DataTypes.STRING(10),
      defaultValue: "-",
    },
    inv_no: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.STRING(45),
    },
    hsn_sac: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    discount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    GST: {
      type: DataTypes.INTEGER,
    },
    total_tax: {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.STRING(45),
    },

    date: {
      type: DataTypes.STRING(45),
    },

    balance: {
      type: DataTypes.INTEGER,
    },
    all_products: {
      type: DataTypes.JSON,
    },

    other_info: {
      type: DataTypes.JSON,
    },
  });

  return quotation;
};
