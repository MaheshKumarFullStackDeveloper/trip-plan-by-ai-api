// routes/ai.js

import express from 'express';
import { body, validationResult } from 'express-validator';

import fetchuser from '../middleware/FetchUser.js';
import Ai from '../models/Ai.js';

const router = express.Router();


router.post('/addchate', fetchuser, [
  body('threads', "Enter name min 5 chr").isLength({ min: 5 }),], async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {  threads } = req.body;

      const Aidata = new Ai({threads,  user: req.user.id
      })
      const savedata = await Aidata.save()
      res.json(savedata)
    } catch (error) {
      res.json(error.message)
      res.status(500).send("same errer");
    }
  });



  router.put('/updatechate/:id', fetchuser, [
    body('threads', "Enter name min 5 chr").isLength({ min: 5 }),], async (req, res) => {

      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
  
        const updateNotes = {};
        const { threads } = req.body;
        updateNotes.threads = threads
  
        let chate = await Ai.findById(req.params.id);
        if (!chate) {
          return res.status(401).send("same errer chate not found");
        }
  
        if (chate.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allow");
        } 
  
        notess = await Ai.findByIdAndUpdate(req.params.id , {$set:updateNotes }, {new :true} )
        res.json({notess});
      } catch (error) {
        res.json(error.message)
        res.status(500).send("same errer");
      }
    });
  
  // Get user all not
router.get('/fetchalthread', fetchuser, async (req, res) => {
  const page = parseInt(req.query.page);
  const perPage = parseInt(req.query.pageSize);
  const startdate = req.query.startdate;
  const enddate = req.query.enddate;
  if(startdate){
    console.log(Date(startdate),enddate);
  }

 // const threads = await Ai.find({$and :[{ user: req.user.id },{ date: {$gte :Date(startdate)}},{ date: {$lte :Date(enddate)}}]}).skip((perPage * page) - perPage).limit(perPage).sort({date : -1});

  const threads = await Ai.find({$and :[{ user: req.user.id },{ date: {$gte :Date(startdate)}}]}).skip((perPage * page) - perPage).limit(perPage).sort({date : -1});
  const count = await Ai.countDocuments({ user: req.user.id });
  res.send({
    threads,
    totalPages: Math.ceil(count / perPage),
    currentPage: page,
  })
});
  
  // Get user all not
router.get('/getthread/:id', fetchuser, async (req, res) => {

  const Thread = await Ai.findById(req.params.id);
  if (!Thread) {
    return res.status(401).send("same errer nots not found");
  }
  if (Thread.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allow");
  } 
  res.send(Thread)
});

  
    router.delete('/deleteThread/:id', fetchuser, async (req, res) => {
    
        try {
  
          let Thread = await Ai.findById(req.params.id);
          if (!Thread) {
            return res.status(401).send("same errer nots not found");
          }
    
          if (Thread.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allow");
          } 
          notess = await Ai.findByIdAndDelete(req.params.id  )
          res.json({"success": "Thread has been deleted" ,notess:notess});
        } catch (error) {
          res.json(error.message)
          res.status(500).send("same errer");
        }
      });


export default router