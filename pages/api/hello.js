import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    // const client = clientPromise;
    const client = await clientPromise;
    const database = client.db('assignment1');
    const collection = database.collection('login');
    const results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (e) {
    console.error(e);
    // res.status(500).json({ error: 'Failed to fetch data' });
  }
}
