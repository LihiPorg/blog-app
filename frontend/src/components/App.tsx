import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import NoteList from './NoteList';
import Pagination from './Pagination';
import AddNote from './AddNote';
import './App.css';
import { useNotes } from '../contexts/NotesContext';
import Login from './login';
import CreateUser from './createUser';
import { useUser, useUserActions } from '../contexts/UsersContext';

function Home() {
  const { notification} = useNotes();
  const { user } = useUser();
  const { logout } = useUserActions();


  const navigate = useNavigate();

  return (
    <div>
      <h1>Notes</h1>
      <div className="notification">{notification}</div>

      {user ? (
        <>
          <button data-testid="logout" onClick={logout}>Logout</button>
          <AddNote />
        </>
      ) : (
        <>
          <button
            data-testid="go_to_login_button"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
          <button
            data-testid="go_to_create_user_button"
            onClick={() => navigate('/create-user')}
          >
            Create New User
          </button>
        </>
      )}

      <NoteList />
      <Pagination />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-user" element={<CreateUser />} />
      </Routes>
    </Router>
  );
}

export default App;
