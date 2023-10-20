const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/user');


const app = express();

app.use(cors());
app.use(express.json());

app.use("/", userRouter);
app.get('/', (req, res) => res.json({msg: "hello world"}));


mongoose.connect('mongodb+srv://elwinjoshua04:gxOscqkOhoxueyK5@cluster0.z6gbs23.mongodb.net/users', {useNewUrlParser: true, useUnifiedTopology: true, dbName: "users"}).then(() => {
    console.log('connected')
})

app.listen(3000, () => console.log('Server is running'))