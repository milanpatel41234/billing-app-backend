const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const payment = sequelize.define('payment', {
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
    },
    invoice_no: {
      type: DataTypes.INTEGER,
      allowNull:false
    },
   invoice_amount:{
    type: DataTypes.INTEGER,
    allowNull:false
   },
   paid_amount:{
    type: DataTypes.INTEGER,
    allowNull:false
   },
   method:{
    type: DataTypes.STRING(45),
    allowNull:false
   },
   date:{
    type: DataTypes.STRING(45),
    allowNull:false
   },
   note:{
    type: DataTypes.STRING(100)
   },

  });

  return payment;
};
