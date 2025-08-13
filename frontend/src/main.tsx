import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import { NotesProvider } from './contexts/NotesContext';
import { UserProvider } from './contexts/UsersContext';


createRoot(document.getElementById('root')!).render(
    <UserProvider>
      <NotesProvider>
        <App />
      </NotesProvider>
    </UserProvider>,
)
