//* IMPORTING
require('dotenv').config()
const path = require("path");
const express = require("express");
const mongoose = require('mongoose')
//var cors = require('cors');

//?SETUP
const app = express();
const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));
//app.use(cors());
app.use(express.json());

const notesUrl = "/api/notes";

//?END SETUP

//!mongooose DB
const Note = require('./models/note')


//!end mongoose DB


//!ROUTES
app.get("/",(req,res) => {
  //res.send("<h1>Hello World!</h1>");
  res.sendFile(path.join(buildPath,"index.html"));
});

app.get(notesUrl, (req,res) => {
  //res.json(notes);
  Note.find({}).then(notes => {
    res.json(notes)
  })
});

app.get(`${notesUrl}/:id`, (req,res) => {
  Note.findById(req.params.id).then(note => {
    res.json(note)
  })
});

app.delete(`${notesUrl}/:id`, (req,res) => {
  const id = Number(req.params.id);
  notes = notes.filter(note => note.id !== id);
  console.log(notes);
  res.status(204).end();
});

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post(notesUrl, (req,res) => {

    const body = req.body
  
    if (body.content === undefined) {
      return res.status(400).json({ error: 'content missing' })
    }
  
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })
  
    note.save().then(savedNote => {
      res.json(savedNote)
    })
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);


//! END ROUTES

//?SERVER RUN

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//?END SERVER RUN