import { Link } from 'react-router-dom';

const AuthForm = ({ type, formData, onInputChange, onSubmit, error, isLoading }) => {
  const isLogin = type === 'login';
  const fields = isLogin
    ? [{ name: 'username', type: 'text', label: 'Username' },
       { name: 'password', type: 'password', label: 'Password' }]
    : [{ name: 'username', type: 'text', label: 'Username' },
       { name: 'email',    type: 'email',    label: 'Email' },
       { name: 'password', type: 'password', label: 'Password' }];

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      {/* ponytail: masthead-style header strip, matches the editorial voice */}
      <header className="border-b border-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center">
          <Link to="/" className="font-serif text-2xl tracking-tightish text-ink" style={{ fontWeight: 400 }}>
            da<span style={{ fontWeight: 600 }}>books</span>
          </Link>
          <span className="ml-4 text-[11px] uppercase tracking-[0.18em] text-muted">
            {isLogin ? 'Sign in' : 'Subscribe'}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink tracking-tightish leading-tight mb-2">
            {isLogin ? <>Welcome <em className="text-accent">back.</em></>
                     : <>Begin your <em className="text-accent">shelf.</em></>}
          </h1>
          <p className="text-sm text-muted mb-10">
            {isLogin ? 'A quiet room for what you read.' : 'A reading collection, quietly kept.'}
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {error && (
              <p className="text-sm text-accent border-l-2 border-accent pl-3">— {error}</p>
            )}

            {fields.map(({ name, type, label }) => (
              <div key={name}>
                <label htmlFor={name} className="block text-[11px] uppercase tracking-[0.16em] text-muted mb-2">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  required
                  value={formData[name]}
                  onChange={onInputChange}
                  className="w-full bg-transparent border-0 border-b border-line focus:border-accent pb-2 px-0 text-ink placeholder-muted outline-none transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 text-sm text-paper bg-ink hover:bg-accent py-3 transition-colors disabled:opacity-50"
            >
              {isLoading ? '…' : isLogin ? 'Sign in →' : 'Create account →'}
            </button>
          </form>

          <p className="mt-10 text-sm text-muted">
            {isLogin
              ? <>No account? <Link to="/register" className="text-accent hover:text-ink border-b border-accent pb-0.5">Subscribe</Link></>
              : <>Already a reader? <Link to="/login" className="text-accent hover:text-ink border-b border-accent pb-0.5">Sign in</Link></>}
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthForm;
