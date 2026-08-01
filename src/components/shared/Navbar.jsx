import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';
import UserSearchBar from '../user/UserSearchBar';

const IconSun = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);
const IconMoon = () => (
  <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);
const IconMenu = ({ open }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
    {open
      ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
      : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
  </svg>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { username, logout, token } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkCls = 'text-sm text-ink/80 hover:text-accent transition-colors';

  return (
    <header className="border-b border-line">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Wordmark */}
          <button
            onClick={() => navigate('/')}
            className="font-serif text-2xl tracking-tightish text-ink"
            style={{ fontWeight: 400 }}
          >
            da<span style={{ fontWeight: 600 }}>books</span>
          </button>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {token && (
              <div className="w-56">
                <UserSearchBar />
              </div>
            )}
            <button onClick={toggleDarkMode} className="text-muted hover:text-ink p-1.5 transition-colors" aria-label="Toggle theme">
              {isDark ? <IconSun /> : <IconMoon />}
            </button>
            {token ? (
              <>
                <button onClick={() => navigate('/profile')} className={linkCls}>{username}</button>
                <button onClick={logout} className={linkCls}>Sign out</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className={linkCls}>Sign in</button>
                <button onClick={() => navigate('/register')} className="text-sm text-accent hover:text-ink transition-colors">Subscribe →</button>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1">
            <button onClick={toggleDarkMode} className="text-muted p-1.5" aria-label="Toggle theme">
              {isDark ? <IconSun /> : <IconMoon />}
            </button>
            <button onClick={() => setIsMenuOpen(o => !o)} className="text-ink p-1.5" aria-label="Menu">
              <IconMenu open={isMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 space-y-3">
            {token && <div className="pb-2"><UserSearchBar /></div>}
            {token ? (
              <>
                <button onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} className="block text-ink">{username}</button>
                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="block text-muted">Sign out</button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="block text-ink">Sign in</button>
                <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="block text-accent">Subscribe →</button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
