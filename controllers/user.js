const User = require('../models/user');

module.exports.renderSignupForm = async(req,res)=>{
    res.render("user/signup.ejs");
};

module.exports.signUp = async(req,res)=>{
    try{
        const {email,username} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,req.body.password);
        await registeredUser.save();
        req.login(registeredUser,(err)=>{
            if(err) next(err)
            else{
                req.flash("success","Registration successful & LoggedIn")
                res.redirect("/list");
            }
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = async(req,res)=>{
    res.render("user/login.ejs");
};

module.exports.logIn = async(req,res)=>{
        req.flash("success","Welcome to WanderLust");
        res.redirect(res.locals.redirectUrl || "/list");
}

module.exports.logOut = async(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        else{
            req.flash("success","Logged out successfully");
            res.redirect('/list')
        }
    })
}