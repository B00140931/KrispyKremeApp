import { withIronSessionApiRoute } from "iron-session/next";

export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { productid, title, description, price, images, quantity } = req.body;

    // Check if the cart_product session exists, if not, initialize it
    if (!req.session.cart_product) {
      req.session.cart_product = {
        items: [],
        total: 0,
      };
    }

    const existingItemIndex = req.session.cart_product.items.findIndex(item => item.id === productid);

    if (existingItemIndex > -1) {
      // Product already in cart, increase the quantity
      req.session.cart_product.items[existingItemIndex].quantity += parseInt(quantity, 10);
      req.session.cart_product.total += req.session.cart_product.items[existingItemIndex].price * parseInt(quantity, 10);
    } else {
      // Add the new donuts to the cart
      const newItem = {
        id: productid,
        name: title,
        description,
        price: parseFloat(price),
        images,
        quantity: parseInt(quantity, 10)
      };
      req.session.cart_product.items.push(newItem);
      req.session.cart_product.total += newItem.price * newItem.quantity;
    }

    await req.session.save();

    // console.log('Session after adding item:', req.session.cart_product);
    console.log('session:', req.session);

    res.status(200).json("updated cart");
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
