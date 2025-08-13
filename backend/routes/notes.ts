import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getNoteByIndex,
  updateNoteByIndex,
  deleteNoteByIndex
} from '../controllers/notesController';

const notesRouter = express.Router();

notesRouter.get('/', getNotes);
notesRouter.post('/', createNote);

notesRouter.get('/by-index/:i', getNoteByIndex);
notesRouter.put('/by-index/:i', updateNoteByIndex);
notesRouter.delete('/by-index/:i', deleteNoteByIndex);

notesRouter.get('/:id', getNoteById);
notesRouter.put('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);

export default notesRouter;
