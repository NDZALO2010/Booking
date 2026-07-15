import { useEffect, useState } from 'react';
import { api } from '../api';

export default function CreditsPage() {
  const [data, setData] = useState(null);
  const [amount, setAmount] = useState('25');
  const [holder, setHolder] = useState('Jordan Lee');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  function formatRand(value) {
    return `R${Number(value).toFixed(2)}`;
  }

  async function loadData() {
    try {
      const next = await api.getCredits();
      setData(next);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setStatus('');

    try {
      const next = await api.loadCredits({ holder, amount: Number(amount) });
      setData(next);
      setStatus(`Added ${formatRand(amount)} to ${holder}'s card.`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page credits-page">
      <section className="hero">
        <p className="eyebrow">Bus card holder account</p>
        <h2>Load travel credits instantly.</h2>
        <p>Top up balances, confirm account status, and keep the card ready for the next trip.</p>
      </section>

      <section className="grid two-up">
        <article className="card balance-card">
          <span className="label">Current balance</span>
          <strong className="value">{data ? formatRand(data.balance) : '--'}</strong>
          <p>{data ? `Card holder: ${data.holder}` : 'Loading account details...'}</p>
        </article>

        <article className="card form-card">
          <h3>Load credits</h3>
          <form onSubmit={handleSubmit} className="stacked-form">
            <label>
              Card holder
              <input value={holder} onChange={(event) => setHolder(event.target.value)} />
            </label>
            <label>
              Amount
              <input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} />
            </label>
            <button type="submit">Load credits</button>
          </form>
          {status ? <p className="success">{status}</p> : null}
          {error ? <p className="error">{error}</p> : null}
        </article>
      </section>

      <section className="card">
        <h3>Recent loads</h3>
        <div className="list">
          {(data?.history ?? []).map((entry) => (
            <div key={entry.id} className="list-row">
              <div>
                <strong>{entry.holder}</strong>
                <p>{entry.timestamp}</p>
              </div>
              <span>+{formatRand(entry.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}