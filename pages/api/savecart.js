import clientPromise from '../../lib/mongodb';
import sanitizeHtml from 'sanitize-html';

export default async function handler(req, res) {
  const { userid, total } = req.body;

  // Validate input
  if (!userid || !total) {
    res.status(400).json({ error: 'All fields are required!' });
    return;
  }

  // Sanitize input
  const sanitizedUserid = sanitizeHtml(userid);
  const sanitizedTotal = parseFloat(sanitizeHtml(total));

  try {
    const client = await clientPromise;
    const database = client.db('assignment1');
    const collection = database.collection('order');
    await collection.insertOne({ userid: sanitizedUserid, total: sanitizedTotal });
    res.status(200).json("ok");
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save data' });
  }
}
