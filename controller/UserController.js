const { response } = require('express')
const User=require('../model/User')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = require('express').Router();




//add new users
const adduser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedpass) {
      if (err) {
        res.json({
          error: err
        });
        return;
      }
  
      let user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedpass
        
      });
  
      user
        .save()
        .then(response => {
          res.json({
            message: 'user added successfully'
          });
        })
        .catch(error => {
          res.json({
            message: 'An error occured'
          });
        });
    });
  };
  

  const login=(req,res,next)=>{
    var username=req.body.username
    var password=req.body.password

    User.findOne({ username })
    .then(user=>{
        if(user){
            bcrypt.compare(password,user.password,function (err,result){
                if(err)
                {
                    res.json({
                        error:err
                    })
                }
                if(result){
                    let token=jwt.sign({username:user.username},'verySecretValue',{expiresIn:'4h'})
                    res.json({
                        message:'login successful!',
                        token
                        
                    })
                } else{
                    res.json({
                        message:'Invalid username or password'
                    })
                }
            })
        } else{
            res.json({
                message:'Invalid username or password'
            })
        }
    })

  }



//show list of users
const index=(req,res,next)=>{
    User.find()
    .then(response=>{
        res.json({
            response
        })
    })
    .catch(error=>{
        res.json({
            message:'An error occured'
        })
    })
}

const search = (req, res, next) => {
    let username = req.body.username;
    User.findOne({ username: username })
      .then(response => {
        if (response) {
          res.json({
            exists: 1
          });
        } else {
          res.json({
            exists: 0
          });
        }
      })
      .catch(error => {
        res.json({
          message: "An error occurred"
        });
      });
  };

  const find = (req, res, next) => {
    let username = req.body.username;
    User.findOne({ username: username })
      .then(response => {
        if (response) {
          res.json({
            user: response
          });
        } else {
          res.json({
            message: "User not found"
          });
        }
      })
      .catch(error => {
        res.json({
          message: "An error occurred"
        });
      });
  };
  
  

//upgrade user from userid

const update=(req,res,next)=>{
    let userID=req.body.userID

    let updatedData={
        username:req.body.username,
        email:req.body.email,
        password:req.body.password
    }

    User.findByIdAndUpdate(userID,{$set:updatedData})
    .then(response=> {
        res.json({
            message:'user updated successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An error occured'
        })
    })
}

//delete user

const destroy=(req,res,next)=>{
    let userID=req.body.userID
    User.findByIdAndRemove(userID)

    .then(response=> {
        res.json({
            message:'user deleted successfully'
        })
    })
    .catch(error=>{
        res.json({
            message:'An error occured'
        })
    })

}


module.exports={
    index,search,adduser,login,update,destroy,find
}
