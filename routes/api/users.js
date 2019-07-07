const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');
const isEmpty=require('./../../validation/isEmpty');
//Load Input Validation
const validateRegisterInput=require('../../validation/register');
const validationLoginInput=require('../../validation/login');
//Load User Model
const User=require('../../models/User');

//GET api/users/test
//access Public

router.get('/test',(req,res)=>{

    res.json({msg:"User Works"});

});

//POST api/user/register
//Register user
//@access Public


router.post('/register',(req,res)=>{
    //Pre-Validation
    const {errors,isValid}=validateRegisterInput(req.body);
    
    if(isValid==false){
        
        return res.status(400).json(errors);
    }

    User.findOne({name:req.body.name})
    .then(user=>{

        //Verify if user already exsist, if not then create a new user
        if(user){
            errors.name='This name already exsist';
            return res.status(404).json(errors);
        }else{
            const newUser=new User({
                name:req.body.name,
                password:req.body.password
            });

            //Password Encryption
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err)throw err;
                    newUser.password=hash;
                    newUser.save()
                    .then(user=>{
                        const payload={
                            id:user.id,
                            name:user.name
                        }
                        jwt.sign(payload,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                            res.json({
                                token:'Bearer '+token
                            })
                        })
                    })
                    .catch(err=>console.log(err));
                })
            })
        }
    });
});


// GET api/user/login
// Login User and return JWT Token
// @access Public

router.post('/login',(req,res)=>{

    const {errors,isValid}=validationLoginInput(req.body);

    //Check Validation

    if(isValid==false){
        return res.status(400).json(errors);
    };
  

    const name=req.body.name;
    const password=req.body.password;

    //Find user by name
    User.findOne({name})
    .then(user=>{

        if(!user){
            return res.status(404).json({name:'User does not exsist'});
        }
        //Check Password
        bcrypt.compare(password,user.password)
        .then(isMatch=>{
            if(isMatch){
                //User is Matched
                //Create Payload for JWT
                const payload={
                    id:user.id,
                    name:user.name
                }
                //Sign the Token
                jwt.sign(payload,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                    res.json({
                        success:true,
                        token:'Bearer '+token
                    })
                });

            }else{
                return res.status(400).json({password:'Password incorrect'});
            }
        });

    });

});

// GET api/user/current
// Return the current user
// @access Private

router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    //req.user gets the user through an authenticated JWT route
    var useme=req.user;

    res.json( {
        "_id":useme.id,
        "name":useme.name,
        "date":useme.date,
        "__v":useme["__v"]
    });
})





module.exports=router;