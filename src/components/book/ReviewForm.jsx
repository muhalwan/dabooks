import { useState } from 'react';

const Star = ({ on, onClick }) => (
  <button type="button" onClick={onClick} className="p-0.5 text-2xl leading-none transition-colors">
    <span className={on ? 'text-star' : 'text-line'}>★</span>
  </button>
);

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !text.trim()) return;
    setIsSubmitting(true);
    try { await onSubmit({ text: text.trim(), rating }); }
    finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Your rating</label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} on={rating >= n} onClick={() => setRating(n)} />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-[0.16em] text-muted mb-2">Your review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows="5"
          autoFocus
          placeholder="What did you think?"
          className="w-full bg-transparent border border-line focus:border-accent p-3 text-ink placeholder-muted outline-none transition-colors resize-none font-serif text-[1.02rem] leading-[1.7]"
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button type="button" onClick={onCancel} className="text-sm text-muted hover:text-ink transition-colors">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="text-sm text-accent hover:text-ink border-b border-accent pb-0.5 disabled:opacity-40 transition-colors"
        >
          {isSubmitting ? 'Submitting…' : 'Publish review →'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
