//* IMPORTING
require('dotenv').config()
const path = require("path");
const express = require("express");
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

app.get(notesUrl, (req,res) => {
  //res.json(notes);
  Note.find({})
  .then(notes => {
    res.json(notes)
  })
  .catch(err => next(err))
});

app.get(`${notesUrl}/:id`, (req,res,next) => {
 Note.findById(req.params.id)
    .then(note => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
});

app.delete(`${notesUrl}/:id`, (req,res,next) => {
  Note.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
});

app.put(`${notesUrl}:id`, (req,res,next) => {
  const body = req.body
  const note = {
    content: body.content,
    important: body.important,
  }
  
  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then(updatedNote => {
      res.json(updatedNote)
    })
    .catch(error => next(error))
});

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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)

//! END ROUTES

//?SERVER RUN

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//?END SERVER RUN