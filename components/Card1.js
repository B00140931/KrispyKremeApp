import { Card, Col, Text } from "@nextui-org/react";

const Card1 = () => (
  <Card hoverable clickable>
    <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
      <Col>
      </Col>
    </Card.Header>
    <Card.Image
      src="/images/header.png"
      objectFit="cover"
      width="100%"
      height={340}
      alt="Fresh Flavours"
    />
  </Card>
);

export default Card1;
