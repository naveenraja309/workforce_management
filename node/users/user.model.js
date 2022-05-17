const { string } = require("joi")
const { DataTypes, DATE } = require("sequelize")

module.exports = model

function model(sequelize) {
  const attributes = {
    user_name: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false, select: false },
    email: { type: DataTypes.STRING, allowNull: false },
    company_name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    no_of_employees: { type: DataTypes.STRING, allowNull: false },
    domain_name: { type: DataTypes.STRING, allowNull: false },
    deleted: { type: DataTypes.TINYINT, allowNull: false }
  }

  const options = {
    timestamps: false,
    defaultScope: {
      // exclude hash by default
      attributes: { exclude: ["hash"] }
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {} }
    }
  }

  return sequelize.define("User", attributes, options)
}
