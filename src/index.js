require('dotenv').config()
const express = require('express');
const route = require('./routes/route')
const mongoose = require('mongoose')
const app = express();

// For Swagger implementation
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))


// express
app.use(express.json());
app.use(cors());
app.use(xss());
app.use(helmet());
app.use('/', route);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => console.log("MongoDb is Connected"))
  .catch((err) => console.log(err));

app.get('/', (req, res) => {
  res.redirect("https://dictionaryapi2.herokuapp.com/api-docs")
//   res.send("<a href='api-docs'><button>Dictionary API Testing</button></a>")
})

let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is Listening on ${port}...`);
})

