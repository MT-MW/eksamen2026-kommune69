const mongoose = require('mongoose');

async function connectToDB(uri) {
    if(!uri) {
        console.log('URI missing')
    }
    await mongoose.connect(uri);
    console.log(`Connected to database!`)
}

module.exports = {
    connectToDB
};