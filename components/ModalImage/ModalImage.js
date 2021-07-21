import React, { useState } from "react";
import {
  Button,
  Modal,
  Col,
  Row,
} from "react-bootstrap";
import ModalImageStyle from "./ModalImage.module.css";

const ModalImage = (props) => {
  const { toggle, show, selectImage, onHide } = props;

  const [modal, setModal] = useState(false);

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        className={ModalImageStyle.modalSize}
      >
        <Modal.Body className={ModalImageStyle.bodyModal}>
          <Row className="text-end">
            <Col>
              <Button onClick={toggle}>x</Button>
            </Col>
          </Row>
          <img className={ModalImageStyle.imgTamaño} src={selectImage} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalImage;
