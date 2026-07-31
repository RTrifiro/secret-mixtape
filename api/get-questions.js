export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://secret-mixtape.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BASE_ID = 'appC0iTgxdZU6UTXV';
  const TABLE_NAME = 'QUESTIONS';
  const API_KEY = process.env.AIRTABLE_API_KEY;

  try {
    let allRecords = [];
    let offset = null;

    do {
      const url = new URL(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`);
      url.searchParams.set('filterByFormula', '{active}=1');
      url.searchParams.set('pageSize', '100');
      if (offset) url.searchParams.set('offset', offset);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_KEY}` }
      });
      const data = await response.json();

      if (!response.ok) {
        return res.status(500).json({ error: 'Could not fetch questions', details: data });
      }

      allRecords = allRecords.concat(data.records);
      offset = data.offset || null;
    } while (offset);

    const questions = allRecords
      .filter((r) => r.fields.category && r.fields.question_text)
      .map((r) => ({
        category: r.fields.category,
        question: r.fields.question_text
      }));

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json({ questions });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
