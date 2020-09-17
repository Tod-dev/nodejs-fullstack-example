import React from 'react'

import dummyNotes from "../data/notes";

const Notes = (props) => {
  const notes = dummyNotes;

  return (
    <>
      <h1 style={{marginBottom:"10vh"}}>Notes</h1> 
      <ul>
  {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </>
  )
};

export default Notes;