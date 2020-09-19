import React from "react";

const Note = ({note, toggleImportant}) => {
  //console.log(note);
  const label = note.important
  ? 'make not important' : 'make important';
return <li>{note.content}<button onClick={toggleImportant}>{label}</button></li>
}
export default Note;