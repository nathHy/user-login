const db = require('../helper/db.js')
const Auth = require('../helper/auth.js')

const User = db.define('user', {
  username: {
    type: db.sequelize.STRING(50),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 50]
    }
  },
  password: {
    type: db.sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [64, 64]
    }
  },
  salt: {
    type: db.sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [32, 32]
    }
  },
}, {
  hooks: {
    beforeValidate: (user, options) => {
      user.salt = Auth.genSalt();
      user.password = Auth.hashPassword(user.password, user.salt);
    }
  }
});

User.prototype.validatePassword = function(rawPassword) {
  return Auth.verify(this.password, rawPassword, this.salt)
}

// create table on startup and create a default admin user
User.sync()
  .then(() => {
    return User.find({ where: {username: 'admin' }})
  })
  .then(user => {
    if (!user) {
      return User.create({username:'admin', password: 'password'})
    }
    return user;
  })
  .catch(console.log)

module.exports = User;