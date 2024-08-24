import clientPromise from '../../lib/mongodb';
import { withIronSessionApiRoute } from 'iron-session/next';
import bcrypt from 'bcrypt';
import sanitizeHtml from 'sanitize-html';
import validator from 'email-validator';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    const { username, password, email, type } = req.body;

    // Validate input - Ensure fields are not blank and match expected format
    if (!username || !password || !email) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Validate input length
    if (username.length > 50 || password.length > 50 || email.length > 50) {
      res.status(400).json({ error: 'Fields must be less than 50 characters' });
      return;
    }

    // Validate email format
    if (!validator.validate(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Sanitize input
    const sanitizedUsername = sanitizeHtml(username);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedPassword = sanitizeHtml(password);
    const sanitizedType = sanitizeHtml(type || 'customer'); // default customer type

    try {
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

      const client = await clientPromise;
      const db = client.db('assignment1');
      const usersCollection = db.collection('users');

      // Store user data
      await usersCollection.insertOne({
        username: sanitizedUsername,
        password: hashedPassword,
        email: sanitizedEmail,
        type: sanitizedType,
        failedLoginAttempts: 0,
        lockoutUntil: null,
      });

      res.status(200).json({ message: 'Registration successful' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'register error' });
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
