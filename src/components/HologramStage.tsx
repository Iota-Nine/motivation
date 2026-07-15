import { motion } from 'framer-motion'

type Props = {
  imageSrc?: string | null
}

export function HologramStage({ imageSrc }: Props) {
  const hasImage = Boolean(imageSrc)

  return (
    <div className="holo-stage">
      <div className="holo-glow" />

      <motion.div
        className="holo-figure"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {hasImage ? (
          <img src={imageSrc!} alt="Hologram" className="holo-img" />
        ) : (
          <div className="holo-placeholder">
            <p>WAITING FOR VISUAL</p>
          </div>
        )}
        <div className="holo-scan" />
      </motion.div>

      <div className="holo-floor" />
    </div>
  )
}
