import Sliderbar from "./Sliderbar"
import { Container, Card, Row, Text, Col, Spacer } from "@nextui-org/react";

const MyLayout = ({children}) => {
    return (
      <> 
        <Sliderbar/>
          {children}
      </>
    );
};

export default MyLayout;