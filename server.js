const env=require('dotenv').config();
const express=require('express');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app=express();
const bodyParser= require('body-parser');
const mongoose=require('mongoose');
const passport=require('passport');
const path=require('path');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const stockprice=require('./routes/api/stockprice');
const connectDB = require('./config/db');
const port=process.env.PORT || 8080;

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Conect to MongodB through mongoose

connectDB();




//Passport Middleware
app.use(passport.initialize());
//Passport Config
require('./config/passport')(passport);



//Use Routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/stockprice',stockprice);

//Serve the Static Assets when in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }

app.listen(port,()=>console.log('Running on Port '+port));
