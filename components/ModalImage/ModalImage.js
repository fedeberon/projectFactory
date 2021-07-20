import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  Col,
  Row,
} from "react-bootstrap";
import ModalImageStyle from "./ModalImage.module.css";

const ModalImage = (props) => {
  const { toggle, isOpen, selectImage } = props;

  const [modal, setModal] = useState(false);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={ModalImageStyle.modalSize}
      >
        <ModalBody className={ModalImageStyle.bodyModal}>
          <Row className="text-end">
            <Col>
              <Button onClick={toggle}>x</Button>
            </Col>
          </Row>
          <img className={ModalImageStyle.imgTamaño} src={selectImage} />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default ModalImage;
