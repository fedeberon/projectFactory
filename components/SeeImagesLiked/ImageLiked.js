import React from "react";
import { Card, CardImg, CardBody } from "reactstrap";

const ImageLiked = ({ image }) => {
  const imgStyles = {
    height: "260px",
    objectFit: "cover",
    // objectPosition: "top",
  };

  return (
    <Card>
      <CardImg
        top
        width="100%"
        style={imgStyles}
        src={image.path}
        alt="Card image cap"
      />
      <CardBody></CardBody>
    </Card>
  );
};

export default ImageLiked;
