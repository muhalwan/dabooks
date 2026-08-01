import Stars from '../shared/Stars';

const BookInfo = ({ book, onReviewClick }) => (
  <section className="pb-10 mb-10 border-b border-line">
    <p className="text-xs uppercase tracking-[0.18em] text-muted mb-4">Book</p>
    <h1 className="font-serif text-4xl sm:text-5xl text-ink tracking-tightish leading-[1.1] mb-2">
      {book?.title}
    </h1>
    <p className="font-serif text-lg italic text-muted mb-6">by {book?.author}</p>

    <div className="flex items-center gap-3 mb-8">
      <Stars value={book?.average_rating} size="text-base" />
      <span className="text-sm text-muted">
        {book?.total_ratings || 0} {book?.total_ratings === 1 ? 'review' : 'reviews'}
      </span>
    </div>

    <p className="font-serif text-[1.05rem] leading-[1.75] text-ink/90 max-w-prose">
      {book?.description || '— No description available.'}
    </p>

    <button
      onClick={onReviewClick}
      className="mt-8 text-sm text-accent hover:text-ink transition-colors border-b border-accent pb-0.5"
    >
      Write a review →
    </button>
  </section>
);

export default BookInfo;
