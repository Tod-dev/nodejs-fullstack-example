import React,{useState, useEffect} from 'react'

import Note from "../models/notes";
//import dummyNotes from "../data/notes";
import Nota from "../components/Note";
import {getAll,create,update,deletenote} from "../services/notes";
import Notification from "../components/Notification";

const newNoteInitialValue = "";

const Notes = () => {
  const [notes,setNotes] = useState([]);
  const [newNote,setNewNote] = useState(newNoteInitialValue);
  const [showAll, setShowAll] = useState(true);
  const [error,setError] = useState(false);
  const [loading,setLoading] = useState(true);
  const [message, setMessage] = useState({text:"", type: "success", show: false});
  const [important, setImportant] = useState(false);

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
      fetchData().catch(err => {console.log(err.message);setError(true)});
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
    const nota = new Note(undefined,newNote, undefined, important);
    const response = await create(nota);
    if(response.ok){
      setMessage({text:"Nota aggiunta Correttamente", type: "success", show: true});
      setLoading(true);
    }
    else{
      setMessage({text:"impossibile aggiungere la nota!", type: "error", show: true});
    }
    setNewNote(newNoteInitialValue);
  };

  const inputChangeHanlder = (event) => {
    setNewNote(event.target.value);
  };

  const importantChangeHandler = (event) => {
    setImportant(!important);
    console.log(!important)
  };

  const toggleImportantHandler = async (id) => {
    //console.log(id);
    const nota = notes.find(nota => nota.id === id);
    const updatedNota = {...nota, important: !nota.important};
    //console.log(updatedNota)
    let res = await update(updatedNota);
    //console.log(json);
    if(res.ok){
      setLoading(true);
      setMessage({type:"success", text:"Importanza della nota modificata correttamente",show:true});

    }else{
      setMessage({type:"error", text:"Impossibile modificare l'importanza della nota!",show:true});
    }
  };

  const deleteNote = async (id) => {
    const nota = notes.find(nota => nota.id === id);
    let res = await deletenote(nota);
    if(res.ok){
      setMessage({type:"success", text:"Nota eliminata correttamente!",show:true});
      setLoading(true);
    }else{
      setMessage({type:"error", text:"Impossibile eliminare la nota!",show:true});
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
        {notesToShow.map(note => 
        <Nota key={note.id} note={note} toggleImportant={() => toggleImportantHandler(note.id)} deleteNote={() => deleteNote(note.id)} />
        )}
      </ul>
      <form onSubmit={formSubmitHandler}>
        <input type="text" value={newNote} placeholder="a new note ..." onChange={inputChangeHanlder} />
        <input type="checkbox" name="important" onChange={importantChangeHandler}/>
        <label for="important">Important</label>
        <button type="submit">Save</button>
      </form>
    </>
  )
};

export default Notes;