import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { productid } = req.body;

    // Check if the cart_product session exists
    if (!req.session.cart_product || !req.session.cart_product.items) {
      res.status(400).json("0 items in the cart to delete");
      return;
    }

    // Find and remove the product from the cart
    const items = req.session.cart_product.items.filter(item => item.id !== productid);
    const product = req.session.cart_product.items.find(item => item.id === productid);

    if (product) {
      // Update the total price
      req.session.cart_product.total -= product.price * product.quantity;
      req.session.cart_product.items = items;

      await req.session.save();
      res.status(200).json("item deleted from cart");
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