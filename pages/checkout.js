import { useRouter } from 'next/router';
import { Table, Row, Col, User, Text, Button, Grid, Tooltip, Input } from "@nextui-org/react";
import { Modal, useModal } from "@nextui-org/react";
import { withIronSessionSsr } from "iron-session/next";
import IconButton from '../components/IconButton';
import DeleteIcon from '../components/DeleteIcon';
import { useState } from 'react';

const columns = [
  { name: "Order Summary", uid: "product" },
  { name: "Quantity", uid: "quantity" },
  { name: "Actions", uid: "actions" },
];

const renderCell = (item, columnKey, handleDelete, handleQuantityChange) => {
  const cellValue = item[columnKey];
  const quantity = item.quantity ? item.quantity : 1; // Default quantity to 1 if not specified

  switch (columnKey) {
    case "product":
      return (
        <User squared src={"/img/" + item.images} name={item.name} css={{ p: 0 }}>
          {item.description}
        </User>
      );
    case "quantity":
      return (
        <Input
          size="xs"
          width="50px"
          initialValue={String(quantity)}
          onChange={(e) => handleQuantityChange(item.id, e.target.value)}
        />
      );
    case "actions":
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

export default function Checkout({ data, itemstotal }) {
  const router = useRouter();
  const { setVisible, bindings } = useModal();
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    county: '',
    eircode: '',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
  });
  const [loading, setLoading] = useState(false);
  const total = itemstotal !== null && itemstotal !== undefined ? itemstotal : 0;

  const handleDelete = async (productId) => {
    const response = await fetch('/api/delete_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productid: productId }),
    });

    if (response.ok) {
      router.reload();
    } else {
      alert('Failed to delete item');
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    const response = await fetch('/api/update_quantity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productid: productId, quantity: parseInt(quantity, 10) }),
    });

    if (response.ok) {
      router.reload();
    } else {
      alert('Failed to update quantity');
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  const handleOrderSubmit = async () => {
    setLoading(true);
    const response = await fetch('/api/submit_order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartItems: data,
        userDetails,
        total,
      }),
    });

    if (response.ok) {
      setVisible(true);

      // Send them to the home page after 3s
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } else {
      alert('Failed to place order');
    }
    setLoading(false);
  };

  return (
    <>
      <Table
        aria-label="Example table with custom cells"
        css={{ height: "auto", minWidth: "100%" }}
        selectionMode="none"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={data}>
          {(item) => (
            <Table.Row key={item.id}>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey, handleDelete, handleQuantityChange)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      <Grid.Container gap={2}>
        <Grid justify="flex-end" xs={10} md={3}>
          <Text h4 color="red" size={22} css={{ m: 20 }}>
            Total
          </Text>
          <Text h4 color="darkgreen" size={22} css={{ m: 20 }}>
            € {total.toFixed(2)}
          </Text>
        </Grid>
      </Grid.Container>

      <Grid.Container gap={1}>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="John Doe"
            label="Full Name"
            type="text"
            id="fullName"
            value={userDetails.fullName}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="john.doe@example.com"
            label="Email"
            type="email"
            id="email"
            value={userDetails.email}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12}>
          <Input
            fullWidth
            size="md"
            placeholder="123 Main St, Apt 4B"
            label="Address"
            type="text"
            id="address"
            value={userDetails.address}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="City"
            label="City"
            type="text"
            id="city"
            value={userDetails.city}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="County"
            label="County"
            type="text"
            id="county"
            value={userDetails.county}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="A65 F4E2"
            label="Eircode"
            type="text"
            id="eircode"
            value={userDetails.eircode}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Input
            fullWidth
            size="md"
            placeholder="4111 1111 1111 1111"
            label="Card Number"
            type="text"
            id="cardNumber"
            value={userDetails.cardNumber}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <Input
            fullWidth
            size="md"
            placeholder="MM/YY"
            label="Expiration Date"
            type="text"
            id="expirationDate"
            value={userDetails.expirationDate}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12} md={3}>
          <Input
            fullWidth
            size="md"
            placeholder="123"
            label="CVC"
            type="text"
            id="cvc"
            value={userDetails.cvc}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid xs={12}>
          <Button
            css={{
              width: '100%',
              height: '40px',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px',
              backgroundColor: 'darkgreen',
              justify: 'center',
            }}
            onClick={handleOrderSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'CONFIRM NOW!'}
          </Button>
          <Modal
            scroll
            width="600px"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            {...bindings}
          >
            <Modal.Header>
              <Text id="modal-title" css={{ fontSize: '18px', fontWeight: 'bold' }}>
                ORDER CONFIRMATION
              </Text>
            </Modal.Header>
            <Modal.Header>
              <Text id="modal-subtitle" size={16}>
                Thank you for your purchase!
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Text id="modal-description">
                We have received your order and will contact you as soon as possible!
              </Text>
            </Modal.Body>
            <Modal.Footer>
              <Button
                css={{
                  height: '30px',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '20px',
                  backgroundColor: 'red',
                }}
                onClick={() => setVisible(false)}
              >
                Thanks!
              </Button>
            </Modal.Footer>
          </Modal>
        </Grid>
      </Grid.Container>
    </>
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

    console.log("getting data from session..");
    const cartProduct = req.session.cart_product || { items: [], total: 0 };

    const itemsWithDefaultQuantity = cartProduct.items.map(item => ({
      ...item,
      quantity: item.quantity ? item.quantity : 1,
    }));

    // const total1 = itemsWithDefaultQuantity.reduce((acc, item) => acc + (item.price), 0);
    const total = itemsWithDefaultQuantity.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return {
      props: {
        data: itemsWithDefaultQuantity,
        itemstotal: total,
      },
    };
  },
  {
    cookieName: "myapp_cookiename",
    password: "complex_password_at_least_32_characters_long",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  }
);
