// ponytail: kept framer-motion (already a dep) only for this quiet opacity fade.
// Springy scale hovers were stripped from buttons/cards — they read as playful,
// not editorial.
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
