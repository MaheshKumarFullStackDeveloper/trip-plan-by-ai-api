import dotenv from 'dotenv';

dotenv.config();


import connectToMongo from './db.js';


connectToMongo();


import authRoutes from './routes/auth.js';
import notesRoutes from './routes/notes.js';
import aiRoutes from './routes/ai.js';
import cors from 'cors'
import express from 'express';
const app = express()
const port = 5000
app.use(cors()) 
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/notes', notesRoutes)
app.use('/ai', aiRoutes)

app.get('/', (req, res) =>res.send('Hello World!')),
   
app.get('/home', (req, res) => res.send('Hello World! page home') ),
app.get('/about', (req, res) =>  res.send('Hello World! page about')),
app.use('/uploads', express.static('uploads'));
app.listen(port, () => {
  console.log(`InotBook Backhaend on port ${port}`)
}) 