import React,{useState, useEffect} from 'react'

import Note from "../models/notes";
//import dummyNotes from "../data/notes";
import Nota from "../components/Note";
import {getAll,create,update} from "../services/notes";
import Notification from "../components/Notification";

const newNoteInitialValue = "";

const Notes = () => {
  const [notes,setNotes] = useState([]);
  const [newNote,setNewNote] = useState(newNoteInitialValue);
  const [showAll, setShowAll] = useState(true);
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(true);
  const [message, setMessage] = useState({text:"", type: "success", show: false});


  useEffect(() => {
    async function fetchData(){
      let response = await getAll();
      //console.log(response);
      if(!response.ok){
        setLoading(false);
        setError(true);
        throw new Error("HTTP error occured");
      }
      else{
        let json = await response.json();
        setNotes(json);
        setLoading(false);
      }
    }
    if(loading){
      fetchData().catch(err => {console.log(err.message); setError(true)});
      //console.log("fetching ...");
    }
    setLoading(false);
  },[loading]);

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if(!newNote.trim()){
      setNewNote(newNoteInitialValue);
      return;
    }
    const nota = new Note(notes.length + 1 ,newNote, new Date().toISOString(), Math.random() < 0.5);
    const response = await create(nota);
    if(response.ok){
      setNotes(notes.concat(nota));
      setMessage({text:"Nota aggiunta Correttamente", type: "success", show: true});
    }
    else{
      setMessage({text:"impossibile aggiungere la nota!", type: "error", show: true});
    }
    setNewNote(newNoteInitialValue);
  };

  const inputChangeHanlder = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportantHandler = async(id) => {
    //console.log(id);
    const nota = notes.find(nota => nota.id === id);
    const updatedNota = {...nota, important: !nota.important};
    let res = await update(updatedNota);
    let json = await res.json();
    //console.log(json);
    if(res.ok){
      //update local data
      const newVet = notes.map(note => note.id !== id ? note : json);
      setNotes(newVet);
      setMessage({type:"success", text:"Importanza della nota modificata correttamente",show:true});

    }else{
      setMessage({type:"error", text:"Impossibile modificare l'importanza della nota!",show:true});
    }
  };

  if(error){
    const mes = {text: "Impossibile caricare le note dal server, controlla la tua connessione",show: true,type:"error"};
    const setMes = () => {
      setError(false);
      setLoading(true);
    };
    return <div className="loaderContainer"> <Notification  message={mes} setMessage={setMes} /> </div> ;
  }
  
  if(loading){
    return <div className="loaderContainer"> <div className="loader"> </div> </div>;
  }

  return (
    <>
      <button onClick={()=> setShowAll(!showAll)}>{showAll ? "filtra per importanti" : "Mostra tutte"}</button>
      <h1 style={{marginBottom:"5vh"}}>Notes</h1> 
      { message.show ? <Notification style={{marginBottom:"5vh"}}  message={message} setMessage={setMessage} />  : null}
      <ul>
        {notesToShow.map(note => <Nota key={note.id} note={note} toggleImportant={() => toggleImportantHandler(note.id)} />)}
      </ul>
      <form onSubmit={formSubmitHandler}>
        <input type="text" value={newNote} placeholder="a new note ..." onChange={inputChangeHanlder} />
        <button type="submit">Save</button>
      </form>
    </>
  )
};

export default Notes;