export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://secret-mixtape.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { record_id, tracking_number } = req.body;

  if (!record_id) {
    return res.status(400).json({ error: 'Missing record_id' });
  }

  const BASE_ID = 'appC0iTgxdZU6UTXV';
  const TABLE_NAME = 'PRODUCERS';
  const API_KEY = process.env.AIRTABLE_API_KEY;

  try {
    const updateUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}/${record_id}`;
    const updateResponse = await fetch(updateUrl, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        typecast: true,
        fields: {
          tape_sent_date: new Date().toISOString(),
          tracking_number: tracking_number || '',
          status: 'Shipped'
        }
      })
    });

    const updateData = await updateResponse.json();

    if (!updateResponse.ok) {
      return res.status(500).json({ error: 'Could not update record', details: updateData });
    }

    return res.status(200).json({ success: true, id: updateData.id });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
