const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const dbHandler = require('./handlers/dbHandler');
const defaultRoutes = require('./routes/defaultRoutes');

const app = express();

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.listen(process.env.PORT, async () => {
    await dbHandler.connectToDB(process.env.DB_URI)
    console.log('app started @ port', process.env.PORT);
});

app.use('/', defaultRoutes);