import { withIronSessionApiRoute } from "iron-session/next";
import sanitizeHtml from 'sanitize-html';

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { productid, quantity } = req.body;

    // Validate input
    if (!productid || !quantity) {
      res.status(400).json("Product ID and quantity are required");
      return;
    }

    // Sanitize input
    const sanitizedProductid = sanitizeHtml(productid);
    const sanitizedQuantity = parseInt(sanitizeHtml(quantity), 10);

    if (isNaN(sanitizedQuantity) || sanitizedQuantity <= 0) {
      res.status(400).json("Invalid quantity");
      return;
    }

    // Check if the cart_product session exists
    if (!req.session.cart_product || !req.session.cart_product.items) {
      res.status(400).json("No items in the cart");
      return;
    }

    const productIndex = req.session.cart_product.items.findIndex(item => item.id === sanitizedProductid);

    if (productIndex > -1) {
      const product = req.session.cart_product.items[productIndex];
      const oldQuantity = product.quantity;

      // Update the quantity and total price
      product.quantity = sanitizedQuantity;
      req.session.cart_product.total += product.price * (sanitizedQuantity - oldQuantity);

      await req.session.save();
      res.status(200).json("Quantity updated");
    } else {
      res.status(404).json("Product not found in cart");
    }
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
