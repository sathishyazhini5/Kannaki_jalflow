const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');   
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

require("dotenv").config();
const pool = require('./config/db.sql')
require("./config/routes")(app)


const port = process.env.PORT || 5005;
app.set('view engine', 'ejs'); // Assuming you are using EJS as the template engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.listen(port,()=>{
    console.log(`server listening on port:${port}`);
});
