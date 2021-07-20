import React, { useEffect } from "react";
import { Card, CardGroup } from "react-bootstrap";

const SeeProjectImages = ({ images }) => {
  useEffect(() => {}, [images]);

  return (
    <>
      <CardGroup>
        {images?.map((image, index) => (
          <Card key={index}>
            <Card.Body>
              <img  width="100%" src={image.path}></img>
            </Card.Body>
          </Card>
        ))}
      </CardGroup>
    </>
  );
};

export default SeeProjectImages;
