const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const purchase_inv = sequelize.define('purchase_inv', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    fy_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
        required: true,
    },
    invoice : {
      type: DataTypes.INTEGER,
      required:true,
      unique: true,
    },
    type : {
      type: DataTypes.STRING(45),
    },
    hsn_sac : {
      type: DataTypes.INTEGER,
    },
    amount : {
      type: DataTypes.INTEGER,
    },
    discount : {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },
    GST : {
      type: DataTypes.INTEGER,
    },
    total_tax : {
      type: DataTypes.INTEGER,
    },
    total: {
      type: DataTypes.STRING(45),
    },
    payment_status: {
      type: DataTypes.STRING(45),
      defaultValue:"unpaid"
    },
    paid_amount:{
        type:DataTypes.INTEGER,
        defaultValue:0,
    },
    date:{
        type:DataTypes.STRING(45),
    },
    paid_date:{
        type:DataTypes.STRING(45),
    },
    balance:{
        type:DataTypes.INTEGER,
    },
    all_products:{
        type:DataTypes.TEXT,
    },
    other_charges:{
        type:DataTypes.TEXT,
    },
    other_info:{
        type:DataTypes.TEXT,
    },
    all_checks:{
     type:DataTypes.TEXT,
    }
  });

  return purchase_inv;
};
