import { useRouter } from 'next/router';
import { withIronSessionSsr } from 'iron-session/next';
import { Table, Row, Col, Tooltip, User, Text, Button, Grid } from '@nextui-org/react';
import IconButton from '../components/IconButton';
import DeleteIcon from '../components/DeleteIcon';

import sanitizeHtml from 'sanitize-html';

const columns = [
  { name: 'Product', uid: 'name' },
  { name: 'Price', uid: 'price' },
  { name: 'Quantity', uid: 'quantity' },
  { name: 'Subtotal', uid: 'subtotal' },
  { name: 'Actions', uid: 'actions' },
];

const renderCell = (item, columnKey, handleDelete) => {
  const cellValue = item[columnKey];
  const quantity = item.quantity ? item.quantity : 1; // default the quantity to 1

  switch (columnKey) {
    case 'name':
      return (
        <User squared src={'/images/' + item.images} name={item.name} css={{ p: 0 }}>
          {item.description}
        </User>
      );
    case 'price':
      return (
        <Text b size={16} css={{ tt: 'capitalize', color: 'darkgreen' }}>
          € {item.price.toFixed(2)}
        </Text>
      );
    case 'quantity':
      return (
        <Text b size={16} css={{ tt: 'capitalize', color: 'green' }}>
          {quantity}
        </Text>
      );
    case 'subtotal':
      return (
        <Text b size={16} css={{ tt: 'capitalize', color: 'darkgreen' }}>
          € {(item.price * quantity).toFixed(2)}
        </Text>
      );
    case 'actions':
      return (
        <Tooltip content="Delete item" color="error">
          <IconButton onClick={() => handleDelete(item.id)}>
            <DeleteIcon size={20} fill="red" />
          </IconButton>
        </Tooltip>
      );
    default:
      return cellValue;
  }
};

export default function Cart({ data, itemstotal }) {
  const router = useRouter();
  const total = itemstotal !== null && itemstotal !== undefined ? itemstotal : 0;

  // Handle item deletion with validation
  const handleDelete = async (productId) => {
    const sanitizedProductId = sanitizeHtml(productId);
    const response = await fetch('/api/delete_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productid: sanitizedProductId }),
    });

    if (response.ok) {
      router.reload();
    } else {
      alert('Failed to delete item');
    }
  };

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        css={{ height: 'auto', minWidth: '100%' }}
        selectionMode="none"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === 'actions'}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={data}>
          {(item) => (
            <Table.Row key={item.id}>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey, handleDelete)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <Grid.Container gap={2} justify="flex-end">
        <Grid xs={12} md={6}>
          <Row justify="flex-end">
            <Text h4 color="red" size={22} css={{ m: 20 }}>
              Total
            </Text>
            <Text h4 color="darkgreen" size={22} css={{ m: 20 }}>
              € {total.toFixed(2)}
            </Text>
          </Row>
        </Grid>
        <Grid xs={12} md={6} justify="flex-end">
          <Button
            auto
            css={{ background: 'darkgreen', color: 'white' }}
            onClick={() => router.push('/checkout')}
            disabled={data.length === 0}
          >
            Proceed to Checkout
          </Button>
        </Grid>
      </Grid.Container>
      {data.length === 0 && (
        <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
          <Grid>
            <Text h4 color="red" size={22} css={{ m: 20 }}>
              Your cart is empty, please add items from the menu to be able to proceed to checkout!
            </Text>
          </Grid>
        </Grid.Container>
      )}
    </>
  );
}

// (every request)
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

    const cartProduct = req.session.cart_product || { items: [], total: 0 };
    // const items = cartProduct.items.map(item => ({...item, quantity: item.quantity));
    const itemsWithDefaultQuantity = cartProduct.items.map(item => ({...item, quantity: item.quantity ? item.quantity : 1}));
    const total = itemsWithDefaultQuantity.reduce((acc, item) => acc + (item.price * item.quantity), 0); // total cost

    return {
      props: {
        data: itemsWithDefaultQuantity,
        itemstotal: total,
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
