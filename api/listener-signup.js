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

  const {
    name,
    email,
    mailing_address,
    format_preference,
    answer_1_question,
    answer_1_text,
    answer_2_question,
    answer_2_text,
    answer_3_question,
    answer_3_text
  } = req.body;

  if (!name || !email || !mailing_address || !format_preference) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const BASE_ID = 'appC0iTgxdZU6UTXV';
  const TABLE_NAME = 'LISTENERS';
  const API_KEY = process.env.AIRTABLE_API_KEY;

  try {
    const checkUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(`{email}='${email}'`)}`;
    const checkResponse = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${API_KEY}` }
    });
    const checkData = await checkResponse.json();

    if (checkData.records && checkData.records.length > 0) {
      return res.status(409).json({ error: 'This email has already signed up' });
    }

    const createUrl = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        typecast: true,
        fields: {
          name,
          email,
          mailing_address,
          format_preference,
          answer_1_question,
          answer_1_text,
          answer_2_question,
          answer_2_text,
          answer_3_question,
          answer_3_text,
          status: 'Unmatched'
        }
      })
    });

    const createData = await createResponse.json();

    if (!createResponse.ok) {
      return res.status(500).json({ error: 'Could not save signup', details: createData });
    }

    return res.status(200).json({ success: true, id: createData.id });
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
}
