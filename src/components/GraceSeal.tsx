/** Elden Ring–inspired grace seal — luminous ring behind the brand. */
export function GraceSeal() {
  return (
    <div className="grace-seal" aria-hidden>
      <span className="grace-seal__ring grace-seal__ring--outer" />
      <span className="grace-seal__ring grace-seal__ring--mid" />
      <span className="grace-seal__core" />
      <span className="grace-seal__ray grace-seal__ray--a" />
      <span className="grace-seal__ray grace-seal__ray--b" />
    </div>
  )
}
