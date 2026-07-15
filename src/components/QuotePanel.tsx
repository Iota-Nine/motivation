import { motion, AnimatePresence } from 'framer-motion'
import type { Quote } from '../data/quotes'

type Props = {
  quote: Quote
}

export function QuotePanel({ quote }: Props) {
  return (
    <section className="quote-panel">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={quote.text}
          className="quote-panel__text"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {quote.text}
        </motion.blockquote>
      </AnimatePresence>
    </section>
  )
}
