const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const product = sequelize.define('product', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
        required: true
   
    },
    varient : {
      type: DataTypes.STRING(45),
    
    },
   
    type : {
      type: DataTypes.STRING(45),
    
    },
    hsn_code : {
      type: DataTypes.INTEGER,
    
    },
   
    mrp_price : {
      type: DataTypes.INTEGER,
    
    },
   
    s_price : {
      type: DataTypes.INTEGER,
      allowNull:false,
      required: true
    },
    p_price : {
      type: DataTypes.INTEGER,
      allowNull:false,
      required: true
    },
    UOM : {
      type: DataTypes.STRING,
    
    },
    opening_qty_per : {
      type: DataTypes.INTEGER,
    
    },
  
    description: {
      type: DataTypes.STRING(45),
      defaultValue: null,
    },
  },);

  return product;
};
