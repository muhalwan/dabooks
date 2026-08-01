import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/shared/Navbar';
import BookCard from '../components/book/BookCard';
import PageTransition from '../components/shared/PageTransition';
import { api } from '../utils/api';

const SortTab = ({ label, active, order, onClick }) => (
  <button
    onClick={onClick}
    className={`relative pb-1.5 text-sm transition-colors ${
      active ? 'text-ink' : 'text-muted hover:text-ink'
    }`}
  >
    {label}
    {active && (
      <>
        <span className="ml-1 text-accent">{order === 'asc' ? '↑' : '↓'}</span>
        <span className="absolute left-0 right-0 -bottom-px h-px bg-accent" />
      </>
    )}
  </button>
);

const Skeleton = () => (
  <div className="border border-line bg-surface p-6 h-56">
    <div className="h-5 w-2/3 bg-line animate-pulse" />
    <div className="h-3 w-1/3 bg-line animate-pulse mt-2" />
    <div className="h-3 w-1/4 bg-line animate-pulse mt-6" />
    <div className="h-3 w-full bg-line animate-pulse mt-4" />
    <div className="h-3 w-5/6 bg-line animate-pulse mt-1.5" />
  </div>
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const { token } = useAuth();

  const fetchBooks = useCallback(async (query = '') => {
    try {
      setIsSearching(true);
      const response = await api.books.getAll(token, query, sortBy, sortOrder, page, 30);
      setBooks(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  }, [token, sortBy, sortOrder, page]);

  useEffect(() => {
    const t = setTimeout(() => fetchBooks(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery, fetchBooks]);

  const handleSortChange = (newSort) => {
    setPage(1);
    if (newSort === sortBy) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortBy(newSort); setSortOrder('asc'); }
  };

  const isFirstPaint = loading && !isSearching && books.length === 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-paper">
        <Navbar />
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-14">
          {/* Masthead */}
          <header className="mb-12 border-b border-line pb-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted mb-3">Vol. I · The Reading Room</p>
            <h1 className="text-4xl sm:text-5xl text-ink tracking-tightish leading-[1.1]">
              Your reading <em className="not-italic text-accent">collection</em>
            </h1>
            <p className="mt-3 text-muted max-w-prose">A quiet shelf of what you've finished, what you're reading, and what's still on the list.</p>
          </header>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
            <div className="w-full sm:w-80">
              <label className="block text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setPage(1); setSearchQuery(e.target.value); }}
                placeholder="Title, author, or word…"
                className="w-full bg-transparent border-0 border-b border-line focus:border-accent pb-2 px-0 text-ink placeholder-muted outline-none transition-colors"
              />
            </div>
            <div className="flex items-end gap-6">
              <SortTab label="Title"      active={sortBy === 'title'}      order={sortOrder} onClick={() => handleSortChange('title')} />
              <SortTab label="Rating"     active={sortBy === 'rating'}     order={sortOrder} onClick={() => handleSortChange('rating')} />
              <SortTab label="Popularity" active={sortBy === 'popularity'} order={sortOrder} onClick={() => handleSortChange('popularity')} />
            </div>
          </div>

          {/* Content */}
          {error ? (
            <p className="text-accent">— {error}</p>
          ) : isFirstPaint ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : books.length === 0 ? (
            <p className="text-muted italic py-10">
              {searchQuery ? '— No volumes match your search.' : '— The shelf is empty.'}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                {books.map((book) => <BookCard key={book._id} book={book} />)}
              </div>

              {pagination && (
                <div className="mt-16 pt-6 border-t border-line flex items-center justify-between text-sm text-muted">
                  <span>
                    {((page - 1) * pagination.per_page) + 1}–{Math.min(page * pagination.per_page, pagination.total)} of {pagination.total}
                  </span>
                  <div className="flex gap-5">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="disabled:opacity-30 hover:text-accent transition-colors"
                    >
                      ← Prev
                    </button>
                    <span className="text-ink">p. {page} / {pagination.pages}</span>
                    <button
                      onClick={() => setPage(p => p + 1)}
                      disabled={page >= pagination.pages}
                      className="disabled:opacity-30 hover:text-accent transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
