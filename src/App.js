import React from 'react';
import Notes from "./pages/Notes";

const mood = "exampleApp"; //initialValue

const App = () => {

  if(mood === "initialValue"){
    return(
      <div className="App">
        <p>App to try things in react, do what you want !</p>
      </div>
    );
  }
  return (
    <div className="App">
      <Notes />
    </div>
  );
}

export default App;
