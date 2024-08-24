import clientPromise from '../../lib/mongodb';
import { withIronSessionApiRoute } from 'iron-session/next';
import bcrypt from 'bcrypt';
import sanitizeHtml from 'sanitize-html';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { username, password } = req.body;

    // Validate input - Ensure fields are not blank and match expected format
    if (!username || !password) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate input length
    if (username.length > 50 || password.length > 50) {
      res.status(400).json({ error: 'Fields must be less than 50 characters' });
      return;
    }

    const sanitizedUsername = sanitizeHtml(username);
    const sanitizedPassword = sanitizeHtml(password);

    try {
      const client = await clientPromise;
      const db = client.db('assignment1');
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ username: sanitizedUsername });

      if (!user) {
        res.status(400).json({ error: 'Invalid username or password' });
        return;
      }

      if (user.lockoutUntil && new Date(user.lockoutUntil) > new Date()) {
        res.status(400).json({ error: 'Account is locked. Try again later.' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(sanitizedPassword, user.password);

      if (!isPasswordValid) {
        const failedLoginAttempts = user.failedLoginAttempts + 1;
        const lockoutUntil = failedLoginAttempts >= 3 ? new Date(new Date().getTime() + 15 * 60000) : null; // Lock password for 15mins

        await usersCollection.updateOne({ _id: user._id }, {
          $set: { failedLoginAttempts, lockoutUntil }
        });

        res.status(400).json({ error: 'Invalid username or password' });
        return;
      }

      await usersCollection.updateOne({ _id: user._id }, {
        $set: { failedLoginAttempts: 0, lockoutUntil: null }
      });

      req.session.user = { id: user._id, username: user.username, type: user.type };
      await req.session.save();

      res.status(200).json({ message: 'Login successful', user: req.session.user });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'login server error' });
    }
  },
  {
    cookieName: 'myapp_cookiename',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: { secure: process.env.NODE_ENV === 'production' },
  }
);