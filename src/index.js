require('dotenv').config()
const express = require('express');
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express();
app.use(express.json());

app.use('/', route);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is Connected"))
  .catch((err) => console.log(err));

let port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is Listening on ${port}...`);
})