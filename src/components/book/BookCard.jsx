import { useNavigate } from 'react-router-dom';
import Stars from '../shared/Stars';

const BookCard = ({ book }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/book/${book._id}`)}
      className="group cursor-pointer border-b border-line pb-6 transition-colors"
    >
      <header className="mb-2">
        <h3 className="font-serif text-xl text-ink leading-snug group-hover:text-accent transition-colors">
          {book.title}
        </h3>
        <p className="text-sm italic text-muted">by {book.author}</p>
      </header>

      <div className="flex items-center gap-2 mb-3">
        <Stars value={book.average_rating} />
        <span className="text-xs text-muted">·</span>
        <span className="text-xs text-muted">
          {book.total_ratings || 0} {book.total_ratings === 1 ? 'review' : 'reviews'}
        </span>
      </div>

      <p className="text-sm text-muted leading-relaxed line-clamp-3">
        {book.description || '— No description available.'}
      </p>
    </article>
  );
};

export default BookCard;
