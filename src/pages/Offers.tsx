import { offers } from '../data/shopData'

export function Offers() {
  return (
    <section className="page-stack">
      <div className="offer-grid">
        {offers.map((offer) => (
          <article className="panel offer-card" key={offer.title}>
            <span className="status">{offer.status}</span>
            <h2>{offer.title}</h2>
            <strong>{offer.discount}</strong>
            <p>{offer.uses} redemptions</p>
            <button className="secondary-action" type="button">
              Edit offer
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

