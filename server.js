const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes')
const cookieParser = require('cookie-parser');

const config = require('./config');

const app = express();
app.use(cookieParser());


app.use(cors())

// app.use(cors({
//     origin: ['http://localhost:5173',],
//     credentials: true
// }));
app.use(bodyParser.json());



const connect = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("connected to db");
    } catch (e) {
        console.log(e);
    }
}

app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

connect();

app.listen(3000, () => console.log("server is running"));
