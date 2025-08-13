import React from 'react';
import NoteItem from './NoteItem';
import { useNotes } from '../contexts/NotesContext';
import './App.css';
const NoteList: React.FC = () => {
  const { notes } = useNotes();

  return (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note._id}>
          <NoteItem note={note} />
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
