const sequelize = require('sequelize')
const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_USER = process.env.DB_USER || 'root'
const DB_PW = process.env.DB_PW || 'root'
const DB_NAME = process.env.DB_NAME || 'login'

const db = new sequelize(DB_NAME, DB_USER, DB_PW, {
	dialect: 'mysql',
	host: DB_HOST
});
db.sequelize = sequelize

module.exports = db;