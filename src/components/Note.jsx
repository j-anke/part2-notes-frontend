const Note = ({ note }) => {
  return note.important ? (
    <li>
      <strong>{note.content}</strong>
    </li>
  ) : (
    <li>{note.content}</li>
  );
};

export default Note;
