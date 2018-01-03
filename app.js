const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');

const apiRouter = require('./src/server/routes/api.js');
const { loginMiddleware, logoutMiddleware, isLoggedIn } = require('./src/server/routes/auth.js');
const customError = require('./src/server/helper/error.js');

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || 'some secret';
const public = path.join(__dirname, 'src/public');

const app = express();

app.use(bodyParser.json());
app.use(session({
  // store: // defaults to MemoryStore
  secret: SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 60000
  }
}))

app.use(logRequest);

app.use('/', express.static(public));
app.post('/login', loginMiddleware);
app.use(isLoggedIn); // Anything after here is authed
app.post('/logout', logoutMiddleware);
app.use('/api/', apiRouter);

app.use((err, req, res, next) => {
  if (err.code === undefined) err.code = 500; // generic errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    err = new customError(err.errors[0].message, 400);
  }

  res.status(err.code);
  res.json({
    status: 'error',
    msg: err.message,
    code: err.code
  });
})

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));

function logRequest(req, res, next) {
  let now = new Date()
  console.log(`${now.toISOString()} ${req.method}: Path: ${req.path} body: ` + JSON.stringify(req.body));
  next()
}