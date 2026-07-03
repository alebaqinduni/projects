// Lahore Exchange — backend
// A small Express API that proxies and caches exchange rates,
// so the frontend never calls a third-party API directly and you
// control rate-limiting, caching, and (later) your own rate sources.

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const UPSTREAM = 'https://open.er-api.com/v6/latest';

app.use(cors());
app.use(express.json());

// in-memory cache: { USD: { rates: {...}, fetchedAt: 169999999 } }
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

async function getRates(base) {
  const cached = cache.get(base);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.rates;
  }
  const res = await fetch(`${UPSTREAM}/${base}`);
  if (!res.ok) throw new Error(`upstream error: ${res.status}`);
  const data = await res.json();
  if (data.result !== 'success') throw new Error('upstream returned failure');
  cache.set(base, { rates: data.rates, fetchedAt: Date.now() });
  return data.rates;
}

// GET /api/rates?base=USD
app.get('/api/rates', async (req, res) => {
  const base = (req.query.base || 'USD').toUpperCase();
  try {
    const rates = await getRates(base);
    res.json({ base, rates, cachedAt: cache.get(base).fetchedAt });
  } catch (err) {
    res.status(502).json({ error: 'Could not fetch rates', detail: err.message });
  }
});

// GET /api/convert?from=USD&to=PKR&amount=100
app.get('/api/convert', async (req, res) => {
  const from = (req.query.from || 'USD').toUpperCase();
  const to = (req.query.to || 'PKR').toUpperCase();
  const amount = parseFloat(req.query.amount || '1');

  if (Number.isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: 'amount must be a positive number' });
  }

  try {
    const rates = await getRates(from);
    const rate = rates[to];
    if (!rate) return res.status(404).json({ error: `No rate for ${to}` });
    res.json({
      from, to, amount,
      rate,
      result: Number((amount * rate).toFixed(4)),
    });
  } catch (err) {
    res.status(502).json({ error: 'Could not convert', detail: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Lahore Exchange API running on port ${PORT}`);
});
