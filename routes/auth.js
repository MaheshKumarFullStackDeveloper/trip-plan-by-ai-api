
// routes/auth.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

import User from '../models/Users.js';
import fetchuser from '../middleware/FetchUser.js';

const router = express.Router();
const jwt_secret = 'sdf234ssdsd';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads")
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({ storage })


router.post('/createuser', [
  body('name', "Enter name min 5 chr").isLength({ min: 5 }),
  body('email', "Enter valid email id").isEmail(),
  body('password', "Enter password min 5 chr").isLength({ min: 5 }),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "yes email alrey" });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data = {
      user: {
        id: user.id
      }
    }
   const datas = jwt.sign(data, jwt_secret);
    success = true
    res.json({ success, datas })
  } catch (error) {
    console.error(error.message)
   
    res.status(500).send({ success, error: "same error" });

  }
});



// Code for login user 

router.post('/login', [
  body('email', "Enter valid email id").isEmail(),
  body('password', "Enter password min 5 chr").isLength({ min: 5 }),
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success, error: "email not registerd" });
    }
    const passwordcoddmpar = await bcrypt.compare(password, user.password);
    if (!passwordcoddmpar) {
      return res.status(400).json({ success, error: "password not crect" });
    }


    const data = {
      user: {
        id: user.id
      }
    }
   const datas = jwt.sign(data, jwt_secret);
    success = true
    res.json({ success, datas })
  } catch (error) {
    console.error(error.message)
    res.status(500).send("same errer");
  }
});


// Code for Get user 

router.get('/getuserdata', fetchuser, async (req, res) => {



  try {
   const UserID = req.user.id;
  
    const user = await User.findById(UserID).select("-password")
    res.send(user)

  } catch (error) {
    console.error(error.message)
    res.status(500).send("same errer");
  }
});

router.put('/updatdbgeneral/', fetchuser, [
  body('name', "Enter name min 5 chr").isLength({ min: 5 }),
  body('email', "Enter valid email id").isEmail(),], async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email } = req.body;
      // db.fruits.find("quantity": {$ne : 20})

      const checkemail = await User.find({ $and :[{ email: email, _id: { $ne: req.user.id } }] });

      const emailCount = checkemail.length;
      if (emailCount > 0) {

        return res.status(401).json("Email already exists. ");
      }

      const updateUser = {};

      updateUser.name = name
      updateUser.email = email


      userss = await User.findByIdAndUpdate(req.user.id, { $set: updateUser }, { new: true })
      res.json({ userss });
    } catch (error) {
      res.json(error.message)
      res.status(500).send("same errer");
    }
  });

router.post('/updatdbprofile/', fetchuser, upload.single('file'), async (req, res) => {

  const {firstname,lastname,nickname,biographicalinfo,shortbio} = req.body;
  const updateUser = {};

  updateUser.firstname = firstname
  updateUser.lastname = lastname
  updateUser.nickname = nickname
  updateUser.biographicalinfo = biographicalinfo
  updateUser.shortbio = shortbio
  
  if(req.file){
   updateUser.photo = req.file.filename
  }

 await User.findByIdAndUpdate(req.user.id, { $set: updateUser }, { new: true })
  res.send("upload Done")
});


router.post('/updatdbpassword/', fetchuser, async (req, res) => {

  const {oldpassword, password} = req.body;
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);
  let success = false;
  let uid =req.user.id
  let user = await User.findById( uid );
  const passwordcoddmpar = await bcrypt.compare(oldpassword, user.password);
    if (!passwordcoddmpar) {
      return res.status(400).json({ success, error: "password not crect" });
    }
    
  const updateUser = {};
   updateUser.password = secPass
  

  userss = await User.findByIdAndUpdate(req.user.id, { $set: updateUser }, { new: true })
  res.send("upload Done")
});


export default router
