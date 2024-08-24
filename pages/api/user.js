import { withIronSessionApiRoute } from 'iron-session/next';
import clientPromise from '../../lib/mongodb';

export default withIronSessionApiRoute(async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const client = await clientPromise;
  const db = client.db('assignment1');
  const usersCollection = db.collection('users');
  const user = await usersCollection.findOne({ username: req.session.user.username });

  if (user) {
    res.status(200).json({ username: user.username, type: user.type });
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}, {
  cookieName: 'myapp_cookiename',
  password: 'complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
});
