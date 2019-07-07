const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const passport=require('passport');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const validateProfileInput=require('../../validation/profile');

//GET api/profile/test

router.get('/test',(req,res)=>{

    res.json({msg:"Profile Works"});

});

// POST api/profile
// Create User Profile
// @access Private

router.post('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

    const {errors,isValid}=validateProfileInput(req.body);

    if(isValid==false){
        return res.status(404).json(errors);
    }
    
    //Get Fields Coming in
    const profileFields={};
    profileFields.user=req.user.id;

    /*
    if(req.body.handle){
        profileFields.handle=req.body.handle;
    }
    */

    if(req.body.balance){
        profileFields.balance=req.body.balance;
    }

    Profile.findOne({user:req.user.id})
    .then(profile=>{
        if(profile){
            //Update Profile Information
            Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
                ).then(profile=>res.json(profile));
        }
        
        else{
            //Create new Profile
            new Profile(profileFields).save().then(profile=>res.json(profile));
            
         
        }
    })
});


// GET api/profile/me
// Get a User's Profile
// @access Private

router.get('/me',passport.authenticate('jwt',{session:false}),(req,res)=>{
   
    Profile.findOne({user:req.user.id}).then(profile=>res.json(profile));
})

// Delete api/profile
// Delete User and Profile
// @access Private

router.delete('/delete',passport.authenticate('jwt',{session:false}),(req,res)=>{

    Profile.findOneAndRemove({user:req.user.id})
    .then(()=>{
        User.findOneAndRemove({_id:req.user.id})
        .then(()=>res.json({success:true}));

    });
});

module.exports=router;