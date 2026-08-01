// ponytail: replaces 6 near-identical ★/☆ blocks across BookCard, BookInfo,
// ReviewList, UserReviews, UserProfile, etc. Uses the `star` token so it
// auto-adapts to dark mode.
const Stars = ({ value = 0, size = 'text-sm' }) => {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className={`inline-flex text-star ${size}`} aria-label={`${v} of 5 stars`}>
      {'★'.repeat(v)}
      <span className="text-line">{'★'.repeat(5 - v)}</span>
    </span>
  );
};

export default Stars;
