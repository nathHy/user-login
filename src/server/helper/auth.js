const crypto = require('crypto');

function genSalt() {
  let string = crypto.randomBytes(128).toString('base64');
  return crypto.createHash('md5')
    .update(string)
    .digest('hex');
}

function hashPassword(password, salt) {
  return crypto.createHash('sha256')
    .update(password + salt)
    .digest('hex')
}

function verify(hash, password, salt) {
  return hash === hashPassword(password, salt);
}

module.exports = { genSalt, hashPassword, verify }