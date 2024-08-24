import { useRouter } from 'next/router';
import { Card, Grid, Row, Text, Button, Input } from '@nextui-org/react';
import { withIronSessionSsr } from 'iron-session/next';
import clientPromise from '../lib/mongodb';
import sanitizeHtml from 'sanitize-html';

export default function Customer({ productsList, temp }) {
  const router = useRouter();

  // Handle form submission with validation
  async function handleSubmit(event) {
    event.preventDefault();

    const productid = sanitizeHtml(event.target.productid.value);
    const title = sanitizeHtml(event.target.title.value);
    const description = sanitizeHtml(event.target.description.value);
    const price = sanitizeHtml(event.target.price.value);
    const images = sanitizeHtml(event.target.images.value);
    let quantity = sanitizeHtml(event.target.quantity.value);

    // Ensure fields are not blank
    if (!productid || !title || !description || !price || !images) {
      alert('All fields are required.');
      return;
    }

    // Set quantity to 1 if not provided or invalid
    quantity = quantity ? parseInt(quantity, 10) : 1;
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a positive number.');
      return;
    }

    const data = { productid, title, description, price, images, quantity };
    const JSONdata = JSON.stringify(data);
    const endpoint = '/api/cart_product';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const result = await response.json();

    alert(`Server result: ${result}`);
  }

  return (
    <div>
      <Text h2 css={{ color: '#b7903c', fontWeight: 'bold', marginLeft: '15px' }} size={24}>
        WEATHER: {temp.toFixed(2)}℃
      </Text>
      <Grid.Container gap={2} justify="flex-start">
        {productsList.map((item) => (
          <Grid xs={12} sm={6} md={4} lg={3} key={item._id}>
            <Card>
              <Card.Body css={{ p: 0 }}>
                <Card.Image src={`/images/${item.images}`} objectFit="cover" width="100%" height={140} alt={item.title} />
              </Card.Body>
              <Card.Footer css={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '10px' }}>
                <Row wrap="wrap" justify="space-between" align="center" css={{ width: '100%' }}>
                  <Text b color="darkgreen">{item.title}</Text>
                  <Text css={{ color: '#b7903c', fontWeight: '$semibold', fontSize: '110%' }}>
                    € {item.price}
                  </Text>
                </Row>
                <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: '10px' }}>
                  <input type="hidden" id='productid' name='productid' value={item.productid}></input>
                  <input type="hidden" id='title' name='title' value={item.title}></input>
                  <input type="hidden" id='description' name='description' value={item.description}></input>
                  <input type="hidden" id='price' name='price' value={item.price}></input>
                  <input type="hidden" id='images' name='images' value={item.images}></input>
                  <Row wrap="wrap" align="center" css={{ width: '100%', marginBottom: '10px' }}>
                    <Text css={{ marginRight: '10px' }}>Quantity:</Text>
                    <Input id='quantity' name='quantity' css={{ width: '80px' }}
                      defaultValue={1}
                      type="number"
                      min={1}
                    />
                  </Row>
                  <Button size="sm" type="submit" css={{ background: 'seagreen', color: 'white', width: '100%' }}>Add to Cart</Button>
                </form>
              </Card.Footer>
            </Card>
          </Grid>
        ))}
      </Grid.Container>
    </div>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const client = await clientPromise;
    const db = client.db('assignment1');
    const productsCollection = db.collection('products');

    const productsCount = await productsCollection.countDocuments();
    if (productsCount === 0) {
      const sampleProducts = [
        { productid: '1', title: 'Product 1', description: 'description 1', price: 10.0, images: 'product1.jpg' },
        { productid: '2', title: 'Product 2', description: 'description 2', price: 20.0, images: 'product2.jpg' },
        { productid: '3', title: 'Product 3', description: 'description 3', price: 30.0, images: 'product3.jpg' },
        { productid: '4', title: 'Product 4', description: 'description 4', price: 40.0, images: 'product4.jpg' },
        { productid: '5', title: 'Product 5', description: 'description 5', price: 50.0, images: 'product5.jpg' },
        { productid: '6', title: 'Product 6', description: 'description 6', price: 60.0, images: 'product6.jpg' },
        { productid: '7', title: 'Product 7', description: 'description 7', price: 70.0, images: 'product7.jpg' },
        { productid: '8', title: 'Product 8', description: 'description 8', price: 80.0, images: 'product8.jpg' },
        { productid: '9', title: 'Product 9', description: 'description 9', price: 90.0, images: 'product9.jpg' },
        { productid: '10', title: 'Product 10', description: 'description 10', price: 100.0, images: 'product10.jpg' },
      ];
      await productsCollection.insertMany(sampleProducts);
    }

    const productsList = await productsCollection.find({}).toArray();
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?id=2964574&appid=0f074601507ca2778d4aa1a39cae4e0f`);
    const apidata = await res.json();
    const temp = apidata.list[0].main.temp - 273.15;

    return {
      props: {
        productsList: productsList.map(product => ({
          ...product,
          _id: product._id.toString(),
        })),
        temp: temp,
      },
    };
  },
  {
    cookieName: 'myapp_cookiename',
    password: 'complex_password_at_least_32_characters_long',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  }
);