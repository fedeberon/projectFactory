import React from "react";
import { Card } from "react-bootstrap";

const ImageLiked = ({ image }) => {
  const imgStyles = {
    height: "260px",
    objectFit: "cover",
    // objectPosition: "top",
  };

  return (
    <Card>
      <Card.Img
        width="100%"
        style={imgStyles}
        src={image.path}
        alt="Card image cap"
      />
      {/* <Card.Body></Card.Body> */}
    </Card>
  );
};

export default ImageLiked;
