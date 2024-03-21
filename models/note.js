const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const note = sequelize.define('note', {
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
        required: true,
    },
    inv_no : {
      type: DataTypes.INTEGER,
      required:true,
      unique: true,
    },
    type : {
      type: DataTypes.STRING(45),
    },
    document_type : {
      type: DataTypes.STRING(45),
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
    
   
    date:{
        type:DataTypes.STRING(45),
    },
   
   
    all_products:{
        type:DataTypes.JSON,
    },
    other_charges:{
        type:DataTypes.JSON,
    },
    other_info:{
        type:DataTypes.JSON,
    },
    all_checks:{
     type:DataTypes.JSON,
    }
  });

  return note;
};
