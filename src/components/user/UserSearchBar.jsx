import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const initial = (name) => (name?.[0] || '?').toUpperCase();

const UserSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);
  const { token } = useAuth();

  useEffect(() => {
    const onClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await api.users.search(q, token);
        setResults(res.data);
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally { setIsSearching(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [query, token]);

  const pick = (u) => {
    navigate(`/user/${u._id}`);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Find a reader…"
        className="w-full bg-transparent border-0 border-b border-line focus:border-accent pb-1.5 px-0 text-sm text-ink placeholder-muted outline-none transition-colors"
      />
      {isSearching && (
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 border border-line border-t-accent rounded-full animate-spin" />
      )}

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-surface border border-line max-h-80 overflow-auto shadow-sm">
          {results.map((u) => (
            <li key={u._id}>
              <button
                onClick={() => pick(u)}
                className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-paper transition-colors"
              >
                <span className="w-8 h-8 flex items-center justify-center border border-line text-accent text-xs font-medium">
                  {initial(u.username)}
                </span>
                <span>
                  <span className="block text-sm text-ink">{u.username}</span>
                  <span className="block text-xs text-muted">{u.reviews_count || 0} reviews</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearchBar;
