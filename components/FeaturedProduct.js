import { Card, Text } from "@nextui-org/react";

const FeaturedProduct = ({ src, title, description }) => (
  <Card hoverable clickable css={{ mw: "400px" }}>
    <Card.Image
      src={src}
      objectFit="cover"
      width="100%"
      height={200}
      alt={title}
    />
    <Card.Body>
      <Text size={16} weight="bold">
        {title}
      </Text>
      <Text size={14}>
        {description}
      </Text>
    </Card.Body>
  </Card>
);

export default FeaturedProduct;
