module.exports = (app,passport)=>{

const {Router} = require('express');
const router = Router();
const Image = require('./models/files');
const {unlink} = require('fs-extra');
const path = require('path'); 

    app.get("/", (req, res) => {
        res.render('index');
    });

    app.get("/signup", (req, res) => {
        res.render('signup',{
            message : req.flash('SignUpMessage')
        })
    });

    app.get("/login", (req, res) => {
        res.render('login',{
            message : req.flash('LoginMessage')
        });
    });

    app.post("/login", passport.authenticate('local-login',{
        successRedirect :'/catalogo',
        failureRedirect:'/login',
        failureFlash:true
    }));

    app.post("/signup",passport.authenticate('local-signup',{
        successRedirect :'/catalogo',
        failureRedirect:'/signup',
        failureFlash:true
    }));

    app.get("/profile",isLogged, (req, res) => {
        res.render('profile',{
            user:req.user
        });
    });

    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect('/');
    });


    function isLogged(req,res,next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    }



    /***
     * 
     * This Section is about Micro services Files
     * 
     */


app.get("/catalogo",isLogged,async (req, res) => {
    const images = await Image.find();
    console.log(images);
    res.render('catalog',{images});
});

app.get("/upload",isLogged ,(req, res) => {
    res.render('upload');
});

app.post("/upload",isLogged,async(req,res)=>{
    const image = new Image();
    image.title = req.body.title;
    image.description = req.body.description;
    image.filename = req.file.filename;
    image.path = '/files/uploads/' + req.file.filename;
    image.originalname = req.file.originalname;
    image.mimetype = req.file.mimetype;
    image.size = req.file.size;
    
    await image.save();
    res.redirect('/catalogo');
});

app.get("/image/:id",isLogged,async (req, res) => {
    const {id} = req.params; 
    const image= await Image.findById(id);
    res.render('profile',{image});
});


app.get("/image/:id/delete/",isLogged,async (req, res) => {
    const {id} = req.params;
    const image = await Image.findByIdAndDelete(id);
    await unlink(path.resolve('./src/public' + image.path))
    res.redirect('/')
});


}