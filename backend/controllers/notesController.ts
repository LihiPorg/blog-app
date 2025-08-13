import { Request, Response, NextFunction } from 'express';
import {
  getNotesService,
  getNoteByIdService,
  getNoteByIndexService,
  createNoteService,
  updateNoteService,
  deleteNoteService
} from '../services/noteService';
import jwt from 'jsonwebtoken';
import User from '../models/userModel'; 
const SECRET = process.env.SECRET || 'secret';

const getTokenFrom = (request: Request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

// GET /notes
export const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query._page as string) || 1;
    const perPage = parseInt(req.query._per_page as string) || 10;
    const skip = (page - 1) * perPage;

    const { notes, total } = await getNotesService(skip, perPage);

    res.setHeader('X-Total-Count', total.toString());
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

// GET /notes/:id
export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const noteID = req.params.id;
    const note = await getNoteByIdService(noteID);

    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// POST /notes
export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token!, SECRET) as { id: string };

    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const { title, content } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Missing title or content' });
      return;
    }

    const note = await createNoteService(title, content, {
     name: user.username,
     email: user.email
     }, user);

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

// PUT /notes/:id
export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token!, SECRET) as { id: string };

    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const noteID = req.params.id;
    const existingNote = await getNoteByIdService(noteID);

    if (!existingNote) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    if (existingNote.user?.toString() !== user._id.toString()) {
      res.status(403).json({ message: 'Forbidden: Not the note owner' });
      return;
    }

    const { title, content, author } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Missing title or content' });
      return;
    }

    const updatedNote = await updateNoteService(noteID, { title, content, author: author ?? null });
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/:id
export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token!, SECRET) as { id: string };

    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const noteID = req.params.id;
    const existingNote = await getNoteByIdService(noteID);

    if (!existingNote) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    if (existingNote.user?.toString() !== user._id.toString()) {
      res.status(403).json({ message: 'Forbidden: Not the note owner' });
      return;
    }

    const deleted = await deleteNoteService(noteID);

    if (deleted) {
      res.sendStatus(204);
    } else {
      res.status(500).json({ message: 'Failed to delete note' });
    }
  } catch (error) {
    next(error);
  }
};

// GET /notes/by-index/:i
export const getNoteByIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const index = parseInt(req.params.i);
    if (isNaN(index) || index < 0) {
      res.status(400).json({ message: 'Invalid index' });
      return;
    }

    const note = await getNoteByIndexService(index);

    if (!note) {
      res.status(404).json({ message: 'Note not found at this index' });
      return;
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

// PUT /notes/by-index/:i
export const updateNoteByIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token!, SECRET) as { id: string };

    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const index = parseInt(req.params.i);
    if (isNaN(index) || index < 0) {
      res.status(400).json({ message: 'Invalid index' });
      return;
    }

    const note = await getNoteByIndexService(index);
    if (!note) {
      res.status(404).json({ message: 'Note not found at this index' });
      return;
    }

    if (note.user?.toString() !== user._id.toString()) {
      res.status(403).json({ message: 'Forbidden: Not the note owner' });
      return;
    }

    const { title, content, author } = req.body;
    if (!title || !content) {
      res.status(400).json({ message: 'Missing title or content' });
      return;
    }

    const updatedNote = await updateNoteService(note._id.toString(), { title, content, author: author ?? null });
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

// DELETE /notes/by-index/:i
export const deleteNoteByIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = getTokenFrom(req);
    const decodedToken = jwt.verify(token!, SECRET) as { id: string };

    if (!decodedToken.id) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    const user = await User.findById(decodedToken.id);
    if (!user) {
      res.status(401).json({ error: 'User not found' });
      return;
    }

    const index = parseInt(req.params.i);
    if (isNaN(index) || index < 0) {
      res.status(400).json({ message: 'Invalid index' });
      return;
    }

    const note = await getNoteByIndexService(index);
    if (!note) {
      res.status(404).json({ message: 'Note not found at this index' });
      return;
    }

    if (note.user?.toString() !== user._id.toString()) {
      res.status(403).json({ message: 'Forbidden: Not the note owner' });
      return;
    }

    const deleted = await deleteNoteService(note._id.toString());

    if (deleted) {
      res.sendStatus(204);
    } else {
      res.status(500).json({ message: 'Failed to delete note' });
    }
  } catch (error) {
    next(error);
  }
};
