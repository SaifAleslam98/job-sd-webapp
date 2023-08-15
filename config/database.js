const mongoose = require('mongoose');

const dbConnection = () => {
    mongoose.set('strictQuery', false);
    mongoose.connect('mongodb://127.0.0.1/job-sd', {
        useNewUrlParser: true,
        useUnifiedTopology: true,

    }).then(conn => {
        console.log(`Connected to db : ${conn.connection.name}`)
    });
}
module.exports = dbConnection;