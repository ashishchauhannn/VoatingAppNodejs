const express = require('express')
const app = express()
const db = require('./db')

require('dotenv').config();
// body parsher
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
// const { jwtMiddelWare } = require('./jwt');

const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)


app.listen(PORT, () => {
    console.log("Server is running...")
})