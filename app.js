const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const path = require('path');


const contactsRouter = require('./routes/api/contactsApi');
const usersRouter = require('./routes/api/usersApi');

const app = express();


const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use('/api/contacts', contactsRouter);
app.use("/api/users", usersRouter);


app.use(( _, res) => {
  res.status(404).json({ message: 'Not found' })
});

app.use((err, res) => {
  res.status(500).json({ message: err.message })
});

module.exports = app
