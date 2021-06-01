import React, { useEffect } from "react";
import { Card, CardBody, CardGroup } from "reactstrap";

const SeeProjectImages = ({ images }) => {
  useEffect(() => {}, [images]);

  return (
    <>
      <CardGroup>
        {images?.map((image, index) => (
          <Card key={index}>
            <CardBody>
              <img  width="100%" src={image.path}></img>
            </CardBody>
          </Card>
        ))}
      </CardGroup>
    </>
  );
};

export default SeeProjectImages;
