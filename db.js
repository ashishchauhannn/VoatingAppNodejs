const mongoose = require('mongoose');
require('dotenv').config();
// const mongoURL = 'mongodb://localhost:27017/db';
// const mongoURL = "mongodb://0.0.0.0:27017/mydb";
// const mongoURL = "mongodb+srv://ashishchauhannn:redmi.65@cluster0.viqsw5z.mongodb.net/";
// const mongoURL = process.env.MONGO_URL;
const mongoURL = process.env.DB_url_local;
mongoose.connect(mongoURL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
        // useUnifiedTopology: true,
    }
)
const db = mongoose.connection;
db.on('connected', () => {
    console.log("connected..");
});
db.on('error', (err) => {
    console.log("there is an error", err);
});
db.on('disconnected', () => {
    console.log("disconnected");
});

module.exports = db;