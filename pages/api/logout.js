import { withIronSessionApiRoute } from 'iron-session/next';

export default withIronSessionApiRoute(
  async function logoutRoute(req, res) {
    req.session.destroy();
    res.status(200).json({ message: 'Logout successful' });
  },
  {
    cookieName: 'myapp_cookiename',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);
