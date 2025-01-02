import Note from "./components/Note";
import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);

  //this function is executed after the initial rendering of the component
  const hook = () => {
    console.log("effect");
    axios.get("http://localhost:3001/notes").then((response) => {
      console.log("promise fulfilled");
      setNotes(response.data); //this state change triggers a re-rendering of the component
    });
  };

  //second parameter defines the reactive values whose change will trigger the effect
  // /specifying an empty array results in a single run (at the initial rendering)
  useEffect(hook, []);

  //first rendering: 0 notes, second rendering: 3 notes
  console.log("render", notes.length, "notes");

  const addNote = (event) => {
    event.preventDefault(); //prevents submitting the form, which causes a page reload

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1),
    };

    setNotes(notes.concat(noteObject));
    setNewNote("");
  };

  const handleNoteChange = (event) => {
    //console.log(event.target.value);
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
