import Note from "./components/Note";
import { useState, useEffect } from "react";
import noteService from "./services/notes";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("a new note...");
  const [showAll, setShowAll] = useState(true);

  //this function is executed after the initial rendering of the component
  const hook = () => {
    noteService.getAll().then((initialNotes) => {
      setNotes(initialNotes); //this state change triggers a re-rendering of the component
    });
  };

  //second parameter defines the reactive values whose change will trigger the effect
  //specifying an empty array results in a single run (at the initial rendering)
  useEffect(hook, []);

  //first rendering: 0 notes, second rendering: 3 notes
  //console.log("render", notes.length, "notes");

  const addNote = (event) => {
    event.preventDefault(); //prevents the default behaviour of form submit, which causes a page reload

    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    };

    noteService.create(noteObject).then((returnedNotes) => {
      setNotes(notes.concat(returnedNotes));
      setNewNote("");
    });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  const toggleImportanceOfNote = (id) => {
    const url = `http://localhost:3001/notes/${id}`;
    const note = notes.find((note) => note.id === id);
    const changedNote = { ...note, important: !note.important };

    noteService.update(id, changedNote).then((returnedNote) => {
      //the notes state variable remains the same except for the one changed note
      setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
    }).catch(error => {
      alert(`the note ${note.content} was already deleted from the server`)
      setNotes(notes.filter(note => note.id !== id))
    })
  };

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
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOfNote(note.id)}
          />
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
