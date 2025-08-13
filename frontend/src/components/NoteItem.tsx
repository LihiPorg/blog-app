import React, { useState } from 'react';
import { Note } from '../contexts/NotesContext';
import { useNotesActions } from '../contexts/NotesContext';
import { useUser } from '../contexts/UsersContext';
import './App.css';

type NoteProps = {
  note: Note;
};

const NoteItem: React.FC<NoteProps> = ({ note }) => {
  const { deleteNote, updateNote } = useNotesActions();
  const { user } = useUser();
  const [text, setEditText] = useState(note.content);
  const [edit, setEdit] = useState(false);

  const isAuthor = user && note.author?.email === user.email;

  return (
    <div className="note" data-testid={note._id}>
      <h2>{note.title}</h2>
      {note.author ? (
        <>
          <p className="note-meta">By {note.author.name}</p>
          <p className="note-meta">{note.author.email}</p>
        </>
      ) : (
        <p className="note-meta">Author: Anonymous</p>
      )}
      <p>{note.content}</p>

      {isAuthor && (
        <>
          <button
            data-testid={`delete-${note._id}`}
            name={`delete-${note._id}`}
            onClick={() => deleteNote(note._id)}
          >
            Delete
          </button>

          {!edit ? (
            <button
              data-testid={`edit-${note._id}`}
              name={`edit-${note._id}`}
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          ) : (
            <>
              <textarea
                data-testid={`text_input-${note._id}`}
                name={`text_input-${note._id}`}
                value={text}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button
                data-testid={`text_input_save-${note._id}`}
                name={`text_input_save-${note._id}`}
                onClick={() => {
                  updateNote(note._id, text);
                  setEdit(false);
                }}
              >
                Save
              </button>
              <button
                data-testid={`text_input_cancel-${note._id}`}
                name={`text_input_cancel-${note._id}`}
                onClick={() => {
                  setEdit(false);
                  setEditText(note.content);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default NoteItem;
