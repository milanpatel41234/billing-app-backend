const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const contact = sequelize.define('contact', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    DL: {
      type: DataTypes.STRING(45),
    },
    GSTIN: {
      type: DataTypes.STRING(45),
    },
    PAN: {
      type: DataTypes.STRING(45),
    },
    TIN: {
      type: DataTypes.STRING(45),
    },
    VAT: {
      type: DataTypes.STRING(45),
    },
    billing_PIN_Code: {
      type: DataTypes.STRING(45),
    },
    billing_address: {
      type: DataTypes.STRING(45),
    },
    billing_city: {
      type: DataTypes.STRING(45),
    },
    billing_country: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    billing_state: {
      type: DataTypes.STRING(45),
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(45),
      unique: true,
    },
    contactType: {
      type: DataTypes.STRING(45),
    },
    isBillAndShipAddressSame: {
      type: DataTypes.BOOLEAN,
    },
    shipping_address: {
      type: DataTypes.STRING(45),
    },
    shipping_city: {
      type: DataTypes.STRING(45),
    },
    shipping_name: {
      type: DataTypes.STRING(45),
    },
    shipping_display_name: {
      type: DataTypes.STRING(45),
    },
    shipping_country: {
      type: DataTypes.STRING(45),
    },
    shipping_email: {
      type: DataTypes.STRING(45),
    },
    shipping_pin_code: {
      type: DataTypes.STRING(45),
    },
    shipping_phone: {
      type: DataTypes.STRING(45),
    },
    shipping_state: {
      type: DataTypes.STRING(45),
    },
  });

  return contact;
};
