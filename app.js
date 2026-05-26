//dependencies
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

//handlers
const dbHandler = require('./handlers/dbHandler');

//require routes
const userRoutes = require('./routes/userRoutes');
const defaultRoutes = require('./routes/defaultRoutes');

//middleware
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

//start app and connect to DB
app.listen(process.env.PORT, async () => {
    await dbHandler.connectToDB(process.env.DB_URI)
    console.log('app started @ port', process.env.PORT);
});

//routes
app.use('/', userRoutes);
app.use('/', defaultRoutes);

//404 catch
app.use((req, res) => {
    res.status(404).render('404', { title: 'error 404' });
});