import clientPromise from '../../lib/mongodb';
import { withIronSessionApiRoute } from 'iron-session/next';
import sanitizeHtml from 'sanitize-html';
import validator from 'email-validator';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'err 405 submit order' });
      return;
    }

    const { cartItems, userDetails, total } = req.body;

    // Validate input - Ensure fields are not blank and match expected format
    if (!cartItems || !userDetails || !total) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const {
      fullName, email, address, city, county, eircode, cardNumber, expirationDate, cvc,
    } = userDetails;

    // Validate email format
    if (!validator.validate(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Ensure no fields are empty
    if (!fullName || !email || !address || !city || !county || !eircode || !cardNumber || !expirationDate || !cvc) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    // Sanitize input and validate length
    const sanitizedCartItems = cartItems.map(item => ({
      ...item,
      productid: sanitizeHtml(item.productid).substring(0, 50),
      title: sanitizeHtml(item.title).substring(0, 50),
      description: sanitizeHtml(item.description).substring(0, 50),
      price: parseFloat(sanitizeHtml(item.price)),
      images: sanitizeHtml(item.images).substring(0, 50),
      quantity: parseInt(sanitizeHtml(item.quantity), 10),
    }));

    const sanitizedUserDetails = {
      fullName: sanitizeHtml(fullName).substring(0, 50),
      email: sanitizeHtml(email).substring(0, 50),
      address: sanitizeHtml(address).substring(0, 50),
      city: sanitizeHtml(city).substring(0, 50),
      county: sanitizeHtml(county).substring(0, 50),
      eircode: sanitizeHtml(eircode).substring(0, 50),
      cardNumber: sanitizeHtml(cardNumber).substring(0, 50),
      expirationDate: sanitizeHtml(expirationDate).substring(0, 50),
      cvc: sanitizeHtml(cvc).substring(0, 50),
    };

    const sanitizedTotal = parseFloat(sanitizeHtml(total));

    try {
      const client = await clientPromise;
      const db = client.db('assignment1');
      const ordersCollection = db.collection('orders');

      const order = {
        cartItems: sanitizedCartItems,
        userDetails: sanitizedUserDetails,
        total: sanitizedTotal,
        status: 'Pending',
        createdAt: new Date(),
      };

      await ordersCollection.insertOne(order);

      // clear the cart data from the session
      req.session.cart_product = { items: [], total: 0 };
      await req.session.save();

      res.status(200).json({ message: 'Order placed successfully' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'server error' });
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
