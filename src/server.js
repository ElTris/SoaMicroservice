const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const multer = require('multer');
const uuid = require('uuid/v4');


const app = express();
const port = process.env.PORT || 5000;
const {url} = require('./config/databaseUser');


mongoose.connect(url,{useNewUrlParser:true});

require('./config/passport')(passport);

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:false}));

const storage = multer.diskStorage({
    destination: path.join(__dirname,'public/files/uploads'),
    filename:(req,file,cb,filename)=>{
        cb(null, uuid() + path.extname(file.originalname));
    }
});

app.use(multer({storage,}).single('image'));

app.use(session({
    secret: 'itrsecret',
    resave:false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


require('./app/routesUser')(app,passport);
//MIDDLEWARE

app.use(express.static(path.join(__dirname,'public')));

app.listen(port, () => console.log(`http://localhost:5000/ Server running on port ${port} 🔥`));