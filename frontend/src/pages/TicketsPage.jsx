import { useEffect, useState } from 'react';
import { api } from '../api';

export default function TicketsPage() {
  const [tickets, setTickets] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getTickets()
      .then(setTickets)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Inventory control</p>
        <h2>Track whether tickets are sold out or available.</h2>
        <p>Keep a clear read on seat inventory before the next bus leaves the station.</p>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section className="grid ticket-grid">
        {(tickets?.items ?? []).map((ticket) => (
          <article key={ticket.id} className="card ticket-card">
            <div className="ticket-top">
              <span className="label">{ticket.route}</span>
              <strong className={ticket.soldOut ? 'pill sold-out' : 'pill available'}>
                {ticket.soldOut ? 'Sold out' : 'Available'}
              </strong>
            </div>
            <h3>{ticket.name}</h3>
            <p>{ticket.detail}</p>
            <div className="ticket-meta">
              <span>{ticket.fare}</span>
              <span>{ticket.remaining} left</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}