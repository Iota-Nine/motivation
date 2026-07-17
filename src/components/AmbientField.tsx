/** Soft light sweep + floating motes for atmospheric depth. */
export function AmbientField() {
  return (
    <div className="ambient" aria-hidden>
      <div className="ambient__sweep" />
      <div className="ambient__orb ambient__orb--a" />
      <div className="ambient__orb ambient__orb--b" />
      <div className="ambient__motes">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} className="ambient__mote" style={{ ['--i' as string]: i }} />
        ))}
      </div>
    </div>
  )
}
