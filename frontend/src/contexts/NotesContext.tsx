import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../components/App.css';
import { useUser } from './UsersContext';

export type Note = {
  _id: string;
  title: string;
  content: string;
  author: { name?: string; email?: string } | null;
};

type State = {
  notes: Note[];
  currentPage: number;
  numNotes: number;
  notification: string;
};

type Action =
  | { type: 'set';  notes: Note[]; total: number }
  | { type: 'added'; note: Note }
  | { type: 'deleted'; id: string }
  | { type: 'updated'; id: string; newContent: string }
  | { type: 'pageChanged'; page: number };

const NOTES_URL = 'http://localhost:3001/notes';
const POSTS_PER_PAGE = 10;

const NotesContext = createContext<State | null>(null);
const NotesDispatchContext = createContext<React.Dispatch<Action> | null>(null);
const NotesActionsContext = createContext<{
  addNote: (text: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  updateNote: (id: string, content: string) => Promise<void>;
  changePage: (page: number) => void;
} | null>(null);

function getNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage < 3) return [1, 2, 3, 4, 5];
  if (currentPage > totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

const notesRef = { current: {} as Record<number, Note[]> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        notes: action.notes,
        numNotes: action.total,
      };
    case 'added':
      return {
        ...state,
        numNotes: state.numNotes + 1,
        notification: 'Added a new note',
      };
    case 'deleted':
      return {
        ...state,
        numNotes: state.numNotes - 1,
        notification: 'Note deleted',
      };
    case 'updated':
      return {
        ...state,
        notes: state.notes.map(n =>
          n._id === action.id ? { ...n, content: action.newContent } : n
        ),
        notification: 'Note updated',
      };
    case 'pageChanged':
      if (!notesRef.current[action.page]) return{
       ...state,
       currentPage: action.page,
      }
      return {
        ...state,
        currentPage: action.page,
        notes: notesRef.current[action.page],
      };
    default:
      throw new Error('Unknown action');
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    notes: [],
    currentPage: 1,
    numNotes: 0,
    notification: 'Notification area',
  });

  const { user } = useUser();

  useEffect(() => {
    const fetchPage = async (page: number) => {
      try {
        const res = await axios.get(NOTES_URL, {
          params: { _page: page, _limit: POSTS_PER_PAGE },
          
        });
        const total = parseInt(res.headers['x-total-count']) || 0;
        notesRef.current[page] = res.data;
        if (page === state.currentPage) {
          dispatch({ type: 'set', notes: res.data, total });
        }
      } catch (err) {
        console.error(`Failed to fetch page ${page}:`, err);
      }
    };

    const totalPages = Math.max(1, Math.ceil(state.numNotes / POSTS_PER_PAGE));
    const visiblePages = getNumbers(state.currentPage, totalPages);

    if (!notesRef.current[state.currentPage]) {
      fetchPage(state.currentPage);
    } else {
      dispatch({
        type: 'set',
        notes: notesRef.current[state.currentPage],
        total: state.numNotes,
      });
    }

    visiblePages
      .filter(p => p !== state.currentPage && !notesRef.current[p])
      .forEach(fetchPage);

    Object.keys(notesRef.current).forEach(key => {
      const page = parseInt(key);
      if (!visiblePages.includes(page)) {
        delete notesRef.current[page];
      }
    });
  }, [state.currentPage, state.numNotes]);

  const addNote = useCallback(async (text: string) => {
    try {
  const response = await axios.post(
    NOTES_URL,
    {
      title: `Note ${state.numNotes + 1}`,
      content: text,
    },
    {
      headers: { Authorization: `Bearer ${user?.token}` },
    }
  );

  notesRef.current = {};
  dispatch({ type: 'added', note: response.data });
} catch (err) {
  console.error('Failed to add note:', err);
}

  }, [state.numNotes, user]);

  const deleteNote = useCallback(async (id: string) => {
    try{
    await axios.delete(`${NOTES_URL}/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });
    notesRef.current = {};
    dispatch({ type: 'deleted', id });
    } catch (err) {
  console.error('Failed to delete note:', err);
}
  }, [user]);

  const updateNote = useCallback(async (id: string, content: string) => {
    const noteToUpdate = state.notes.find(n => n._id === id);
    if (!noteToUpdate) return;
    try{
    await axios.put(`${NOTES_URL}/${id}`, {
      title: noteToUpdate.title,
      content,
      author: noteToUpdate.author ?? null,
    }, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    dispatch({ type: 'updated', id, newContent: content });
  } catch (err) {
    console.error('Failed to update note:', err);
  }
  }, [state.notes, user]);

  const changePage = useCallback((page: number) => {
    notesRef.current[state.currentPage] = state.notes;
    dispatch({ type: 'pageChanged', page });
  }, [state.currentPage, state.notes]);

  return (
    <NotesContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        <NotesActionsContext.Provider value={{ addNote, deleteNote, updateNote, changePage }}>
          {children}
        </NotesActionsContext.Provider>
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
}

export function useNotesDispatch() {
  const context = useContext(NotesDispatchContext);
  if (!context) throw new Error('useNotesDispatch must be used within NotesProvider');
  return context;
}

export function useNotesActions() {
  const context = useContext(NotesActionsContext);
  if (!context) throw new Error('useNotesActions must be used within NotesProvider');
  return context;
}
