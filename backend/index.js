const path = require("path");
const express = require("express");
const mongoose = require('mongoose')
require('dotenv').config()
//var cors = require('cors');
const app = express();

const buildPath = path.join(__dirname, '..', 'build');

app.use(express.static(buildPath));
//app.use(cors());
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true
  }
];

const notesUrl = "/api/notes";

//mongooose

const dbname = "note-app"

const url =
 `mongodb+srv://itsmetod:${process.env.DB_PSW}@cluster0.erdvr.mongodb.net/${dbname}?retryWrites=true&w=majority` 

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

//end mongoose

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
  const id = Number(req.params.id);
  const note = notes.find(note => note.id === id);
  if(note)
    res.json(note);
  else  
    res.status(404).end();
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

  const body = req.body;

  if(!body.content){
    return res.status(400).json({"error": "content missing"});
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }

  notes = notes.concat(note);
  res.json(note);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
};

app.use(unknownEndpoint);

const PORT = process.env.PORT ||  3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));