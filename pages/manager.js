import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Card, Text, Grid } from '@nextui-org/react';
import { withIronSessionSsr } from 'iron-session/next';
import clientPromise from '../lib/mongodb';

export default function Manager({ initialStats, error: initialError }) {
  const [stats, setStats] = useState(initialStats);
  const [error, setError] = useState(initialError);

  const router = useRouter();

  // Prevent non managers from viewing the page
  useEffect(() => {
    if (initialError === 'Unauthorized') {
      router.push('/login');
    }
  }, [initialError, router]);

  if (error === 'Unauthorized') {
    return <Text h2 color="red">You are not authorized to view this!</Text>;
  }

  return (
    <Container>
      {stats ? (
        <Grid.Container gap={2}>
          <Grid xs={12} md={6}>
            <Card>
              <Card.Body>
                <Text h3>Total Orders</Text>
                <Text h1>{stats.totalOrders}</Text>
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={12} md={6}>
            <Card>
              <Card.Body>
                <Text h3>Total Cost</Text>
                <Text h1>€ {stats.totalCost.toFixed(2)}</Text>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      ) : (
        <Text h2 color="red">Loading...</Text>
      )}
      {error && error !== 'Unauthorized' && (
        <Text color="red">{error}</Text>
      )}
    </Container>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;

    if (!user || user.type !== 'manager') {
      return {
        props: {
          initialStats: null,
          error: 'Unauthorized',
        },
      };
    }

    try {
      const client = await clientPromise;
      const db = client.db('assignment1');
      const ordersCollection = db.collection('orders');

      const orders = await ordersCollection.find({}).toArray();
      const totalOrders = orders.length;
      const totalCost = orders.reduce((acc, order) => acc + order.total, 0);

      return {
        props: {
          initialStats: { totalOrders, totalCost },
          error: null,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        props: {
          initialStats: null,
          error: 'Internal server error',
        },
      };
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