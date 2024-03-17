const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require("dotenv").config();
app.use(express.static('public'));
const manage = require('./Controller/manage');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/', manage);

const connecting = () => {
    const uri = `mongodb+srv://resourceDB:oRycpG8SxJ92UkwB@cluster0.waps95s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
    return uri;
}

const connectDB = async () => {
    console.log('testing.....');
    const test = connecting();
    await mongoose.connect(test, { dbName: 'ResourceDB' })
    console.log('connected');
}

const final = async () => {
    await connectDB()
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

final()