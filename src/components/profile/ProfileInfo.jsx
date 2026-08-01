const initial = (name) => (name?.[0] || '?').toUpperCase();

const ProfileInfo = ({ user }) => {
  if (!user) return null;
  const reviews = user.reviews || [];
  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="pb-8 mb-10 border-b border-line">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-14 h-14 flex items-center justify-center border border-line bg-surface">
          <span className="font-serif text-2xl text-accent">{initial(user.username)}</span>
        </div>
        <div>
          <h1 className="font-serif text-3xl text-ink tracking-tightish leading-tight">{user.username}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm max-w-md">
        <dt className="text-muted">Reviews written</dt>
        <dd className="text-ink text-right">{reviews.length}</dd>
        <dt className="text-muted">Average rating given</dt>
        <dd className="text-ink text-right">{avg ? `${avg} ★` : '—'}</dd>
      </dl>
    </section>
  );
};

export default ProfileInfo;
