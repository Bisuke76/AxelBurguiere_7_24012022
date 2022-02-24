module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(191),
      allowNull: false,
      unique: 'uniqueIndex'
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    biography: Sequelize.TEXT,
    image: Sequelize.STRING(191),
    sex: {
      type: Sequelize.STRING(1),
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    isAdmin: {
      type: Sequelize.BOOLEAN
    }
    }, {
    timestamps: false
  });


  return User;
};