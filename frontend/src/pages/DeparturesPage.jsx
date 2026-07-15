import { useEffect, useState } from 'react';
import { api } from '../api';

export default function DeparturesPage() {
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getSchedule()
      .then(setSchedule)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Route timing</p>
        <h2>Departure and arrival tracking.</h2>
        <p>Monitor the next bus events in one view so riders and dispatch know what is due next.</p>
      </section>

      {error ? <p className="error">{error}</p> : null}

      <section className="grid two-up">
        <article className="card">
          <h3>Upcoming departures</h3>
          <div className="list">
            {(schedule?.departures ?? []).map((item) => (
              <div key={item.tripId} className="list-row">
                <div>
                  <strong>{item.route}</strong>
                  <p>{item.stop}</p>
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <h3>Arrival board</h3>
          <div className="list">
            {(schedule?.arrivals ?? []).map((item) => (
              <div key={item.tripId} className="list-row">
                <div>
                  <strong>{item.route}</strong>
                  <p>{item.destination}</p>
                </div>
                <span>{item.time}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}