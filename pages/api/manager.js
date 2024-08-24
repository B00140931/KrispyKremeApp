import clientPromise from '../../lib/mongodb';
import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const user = req.session.user;

    if (!user || user.type !== 'manager') {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const client = await clientPromise;
      const db = client.db('assignment1');
      const ordersCollection = db.collection('orders');

      const orders = await ordersCollection.find({}).toArray();
      const totalOrders = orders.length;
      const totalCost = orders.reduce((acc, order) => acc + order.total, 0);

      res.status(200).json({ totalOrders, totalCost });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
  {
    cookieName: 'myapp_cookiename',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);
