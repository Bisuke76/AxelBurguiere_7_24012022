module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define("role", {
    name: {
      type: Sequelize.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false
  })

  return Role;
};