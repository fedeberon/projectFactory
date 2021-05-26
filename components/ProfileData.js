import React, { useState } from "react";
import { ListGroupItem, ListGroup, Button, Container } from "reactstrap";

const ProfileData = (props) => {
  return (
    <Container>
      <ListGroup>
        <h3>Nombre</h3>
        <ListGroupItem>Facundo</ListGroupItem>
        <h3>Apellido</h3>
        <ListGroupItem>Recki</ListGroupItem>
        <h3>Email</h3>
        <ListGroupItem>pepito@gmail.com</ListGroupItem>
        <h3>Rol</h3>
        <ListGroupItem>Profesional</ListGroupItem>
      </ListGroup>
      <Button className="mt-3 text-white" color="info">
        mis proyectos
      </Button>
    </Container>
  );
};

export default ProfileData;
