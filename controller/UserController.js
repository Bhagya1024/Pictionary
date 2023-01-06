const { response } = require('express')
const User=require('../model/User')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = require('express').Router();

// Configure the multer middleware to handle the image file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../src/app/assets/userdp');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });


const saveimage=(req,res,next)=>{
  let username = req.body.username;
  const file = req.file;
  // const file=req.body.image;
  // const filePath = path.join(__dirname, '../assets/userdp', file.originalname);
  // const filePath = path.join(__dirname, '../src/app/assets/userdp', username);
console.log(file)
// console.log(filePath)
  // fs.writeFile(filePath, file.buffer, (err) => {
  //   if (err) {
  //     console.error(err);
  //     res.send({ success: false });
  //   } else {
  //     res.send({ success: true, imageUrl: filePath });
  //   }
  // });

}                                                                                                         


//add new users  - sign up
// const adduser=(req,res,next)=>{
//     let user = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password: req.body.password,
//         dp: req.body.dp
//       })
      
//     user.save()
//     .then(response=> {
//         res.json({
//             message:'user added successfully'
//         })
//     })
//     .catch(error=>{
//         res.json({
//             message:'An error occured'
//         })
//     })
// }



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
        password: hashedpass,
        imageurl: '/assets/userdp/' + req.body.username
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
        password:req.body.password,
        dp:req.body.dp
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
    index,search,adduser,login,update,destroy,find,saveimage,upload
}
