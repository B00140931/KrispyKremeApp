import { Container, Grid, Text, Row, Button, Link } from "@nextui-org/react";
import Card1 from "../components/Card1";
import FeaturedProduct from "../components/FeaturedProduct.js";

export default function HomePage() {
  return (
    <Container css={{ marginTop: '20px' }}>
      <Card1 />
      <Grid.Container gap={2} justify="center" css={{ marginTop: '20px' }}>
        <Grid xs={12} sm={6} md={4}>
          <FeaturedProduct
            src="/images/product3.png"
            title="Original Glazed"
            description="Our signature original glazed doughnut."
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FeaturedProduct
            src="/images/product1.png"
            title="Chocolate Iced"
            description="Delicious doughnut topped with rich chocolate icing."
          />
        </Grid>
        <Grid xs={12} sm={6} md={4}>
          <FeaturedProduct
            src="/images/product2.png"
            title="Strawberry Sprinkles"
            description="Sweet strawberry icing with colorful sprinkles."
          />
        </Grid>
      </Grid.Container>
      <Row justify="center" css={{ marginTop: '40px', textAlign: 'center' }}>
        <Text h2 color="darkgreen">
          Welcome to Krispy Kreme
        </Text>
        <Text size={18} css={{ maxWidth: '600px' }}>
          Discover our delicious range of fresh amazing doghnuts made with the finest ingredients!
        </Text>
        <Button
          auto
          flat
          as={Link}
          href="/customer "
          css={{ marginTop: '20px', backgroundColor: 'darkgreen', color: 'white' }}
        >
          Explore Our Menu
        </Button>
      </Row>
    </Container>
  );
}
