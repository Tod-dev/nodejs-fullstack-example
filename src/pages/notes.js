import React,{useState, useEffect} from 'react'

import Note from "../models/notes";
//import dummyNotes from "../data/notes";

const newNoteInitialValue = "";

const Notes = () => {
  const [notes,setNotes] = useState([]);
  const [newNote,setNewNote] = useState(newNoteInitialValue);
  const [showAll, setShowAll] = useState(true);
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(true);


  useEffect(() => {
    async function fetchData(){
      let response = await fetch('http://localhost:3001/notes');
      if(!response.ok){
        setLoading(false);
        console.log("errore");
        setError(true);
        return;
      }
      let json = await response.json();
      if(!json){
        console.log("errore");
        setLoading(false);
        setError(true);
        return;
      }
      //console.log(json);
      setNotes(json);
      setLoading(false);
    }
    fetchData();
  },[]);

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const formSubmitHandler = (event) => {
    event.preventDefault();
    if(!newNote.trim()){
      setNewNote(newNoteInitialValue);
      return;
    }
    const newNotes = notes.concat(new Note(notes.length + 1 ,newNote, new Date().toISOString(), Math.random() < 0.5));
    setNotes(newNotes);
    setNewNote(newNoteInitialValue);
  };

  const inputChangeHanlder = (event) => {
    setNewNote(event.target.value);
  };

  if(error){
    return <div className="loaderContainer"> <p>Impossibile caricare le note dal server, controlla la tua connessione</p> </div> ;
  }
  
  if(loading){
    return <div className="loaderContainer"> <div className="loader"> </div> </div>;
  }

  return (
    <>
      <button onClick={()=> setShowAll(!showAll)}>{showAll ? "filtra per importanti" : "Mostra tutte"}</button>
      <h1 style={{marginBottom:"10vh"}}>Notes</h1> 
      <ul>
        {notesToShow.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
      <form onSubmit={formSubmitHandler}>
        <input type="text" value={newNote} placeholder="a new note ..." onChange={inputChangeHanlder} />
        <button type="submit">Save</button>
      </form>
    </>
  )
};

export default Notes;