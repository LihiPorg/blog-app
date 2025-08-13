import { useState } from 'react';
import { useNotesActions } from '../contexts/NotesContext';
import { useUser } from '../contexts/UsersContext';

export default function AddNote() {
  const { addNote } = useNotesActions();
  const [text, setText] = useState('');
  const [add, setAdd] = useState(false);

  const { user } = useUser();

  if (!user) return <p>Please log in to add a note.</p>;

  return (
    <>
      {!add ? (
        <button data-testid="add_new_note" name="add_new_note" onClick={() => setAdd(true)}>Add New</button>
      ) : (
        <div>
          <input
            type="text"
            value={text}
            data-testid="text_input_new_note"
            name="text_input_new_note"
            onChange={(e) => setText(e.target.value)}
          />
          <button
            data-testid="text_input_save_new_note"
            name="text_input_save_new_note"
            onClick={() => {
              if (text.trim()) {
                addNote(text.trim());
              }
              setText('');
              setAdd(false);
            }}
          >
            Save
          </button>
          <button
            name="text_input_cancel_new_note"
            data-testid="text_input_cancel_new_note"
            onClick={() => {
              setText('');
              setAdd(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </>
  );
}



