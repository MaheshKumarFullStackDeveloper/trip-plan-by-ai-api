
import express from 'express';
import { body, validationResult } from 'express-validator';

import fetchuser from '../middleware/FetchUser.js';
import Notes from '../models/Notes.js';

const router = express.Router();

// Get user all not
router.get('/fetchallnotes', fetchuser, async (req, res) => {

  const notes = await Notes.find({ user: req.user.id })

  res.send(notes)
});



// Save user Note


router.post('/addnot', fetchuser, [
  body('title', "Enter name min 5 chr").isLength({ min: 5 }),
  body('discription', "Enter name min 5 chr").isLength({ min: 5 }),], async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, discription, tag } = req.body;

      const notes = new Notes({
        title, discription, tag, user: req.user.id
      })
      const savedata = await notes.save()
      res.json(savedata)
    } catch (error) {
      res.json(error.message)
      res.status(500).send("same errer");
    }
  });



router.put('/updatenote/:id', fetchuser, [
  body('title', "Enter name min 5 chr").isLength({ min: 5 }),
  body('discription', "Enter name min 5 chr").isLength({ min: 5 }),], async (req, res) => {

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const updateNotes = {};
      const { title, discription, tag } = req.body;
      updateNotes.title = title
      updateNotes.discription = discription
      updateNotes.tag = tag

      let note = await Notes.findById(req.params.id);
      if (!note) {
        return res.status(401).send("same errer nots not found");
      }

      if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allow");
      } 

      notess = await Notes.findByIdAndUpdate(req.params.id , {$set:updateNotes }, {new :true} )
      res.json({notess});
    } catch (error) {
      res.json(error.message)
      res.status(500).send("same errer");
    }
  });



  router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  
      try {

        let note = await Notes.findById(req.params.id);
        if (!note) {
          return res.status(401).send("same errer nots not found");
        }
  
        if (note.user.toString() !== req.user.id) {
          return res.status(401).send("Not Allow");
        } 
        notess = await Notes.findByIdAndDelete(req.params.id  )
        res.json({"success": "note has been deleted" ,notess:notess});
      } catch (error) {
        res.json(error.message)
        res.status(500).send("same errer");
      }
    });
  

export default router;
