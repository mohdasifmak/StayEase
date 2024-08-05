const User = require("../Models/user");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.renderSignUpForm =  (req, res)=>{
    res.render("users/signup.ejs");
};



module.exports.signUp = async(req, res)=>{
    try{
        let {name, email, username, password} = req.body;
        const newUser = new User({name, email,  username});
        const registerUser = await User.register(newUser, password);


        req.login(registerUser, (err)=>{  //to login user automatic when he sing up
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to StayEase");
            
            let redirect = res.locals.redirectUrl || "/listings";
            res.redirect(redirect); 
        })
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
   
};



module.exports.renderLoginForm = (req, res)=>{
    res.render("users/login.ejs");
};



module.exports.logIn = async(req,res)=>{
    
    //req.flash("success", "Welcome back To StayEase");
    //res.redirect("/listings");
    
    let redirect =  res.locals.redirectUrl || "/listings";
    res.redirect(redirect);
};



module.exports.logOut = (req, res, next)=>{
    req.logout((err)=>{  //req.logout track the user seassion if user log in then it delete the session details.
       if(err){
        return next(err);
       } 
       req.flash("success", "You are logged out");
       res.redirect("/listings");
    });
};