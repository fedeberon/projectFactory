import React, { useState } from "react";
import { Button, Modal, Col, Row } from "react-bootstrap";
import { X } from "react-bootstrap-icons";
import ModalImageStyle from "./ModalImage.module.css";

const ModalImage = (props) => {
  const { toggle, show, selectImage, onHide } = props;

  const [modal, setModal] = useState(false);

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        className={`${ModalImageStyle.modalSize} p-0`}
        dialogClassName="mw-100 vh-100 m-0 overflow-hidden "
      >
        <Modal.Body className={`${ModalImageStyle.bodyModal} p-0`}>
          <Row className="text-end">
            <Col className="vh-100">
              <Button variant="danger" className="p-1 m-1 position-absolute top-0 end-0" onClick={toggle}>
                <X size={25} />
              </Button>
              <img className={ModalImageStyle.img} src={selectImage} />
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalImage;
