
import { useNotesActions } from '../contexts/NotesContext';
import { useNotes } from '../contexts/NotesContext';
import './App.css';

function getNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (currentPage < 3) return [1, 2, 3, 4, 5];
  if (currentPage > totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
}

const Pagination = (
) => {
  const{ currentPage,numNotes } = useNotes();
  const { changePage } = useNotesActions();
  const numPages = Math.max(1, Math.ceil(numNotes / 10));
  const pagesButtons = getNumbers(currentPage, numPages);

  return (
    <div>
      <button 
        name="first" 
        onClick={() => changePage(1)} 
        disabled={currentPage === 1}
      >
        First
      </button>
      <button 
        name="previous" 
        onClick={() => changePage(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {pagesButtons.map((page) => (
        <button
          key={page}
          name={`page-${page}`}
          onClick={() => changePage(page)}
          disabled={page === currentPage}
          style={{ fontWeight: page === currentPage ? 'bold' : 'normal' }}
          className={page === currentPage ? 'active' : ''}
        >
          {page}
        </button>
      ))}

      <button 
        name="next" 
        onClick={() => changePage(Math.min(numPages, currentPage + 1))} 
        disabled={currentPage === numPages}
      >
        Next
      </button>
      <button 
        name="last" 
        onClick={() => changePage(numPages)} 
        disabled={currentPage === numPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;