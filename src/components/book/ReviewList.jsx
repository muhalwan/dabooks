import Stars from '../shared/Stars';

const fmt = (iso) => {
  try { return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
  catch { return ''; }
};

const ReviewList = ({ reviews }) => (
  <section>
    <h2 className="font-serif text-2xl text-ink mb-6">Reviews</h2>

    {(!reviews || reviews.length === 0) ? (
      <p className="text-muted italic">— No reviews yet. Be the first to write one.</p>
    ) : (
      <ul className="divide-y divide-line">
        {reviews.map((r) => (
          <li key={r._id} className="py-6 first:pt-0 last:pb-0">
            <header className="flex items-baseline justify-between gap-4 mb-2">
              <span className="font-medium text-ink">{r.user?.username || 'Anonymous'}</span>
              <div className="flex items-center gap-3">
                <Stars value={r.rating} />
                <span className="text-xs text-muted">{fmt(r.created_at || r.date_posted)}</span>
              </div>
            </header>
            <p className="font-serif text-[1.02rem] leading-[1.7] text-ink/90 max-w-prose">{r.text}</p>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default ReviewList;
