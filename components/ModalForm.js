import React, { useState } from "react";
import {
  Button,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import { X } from "react-bootstrap-icons";
const ModalForm = (props) => {
  const { className, modalTitle, formBody, modalOpen, size } = props;

  const toggle = () => modalOpen.function(!modalOpen.open);
  return (
    <div>
      <Modal
        centered
        size={size}
        show={modalOpen.open}
        className={className}
      >
        <Row className="row m-2 px-2 pt-2">
          <Col className="col-10 p-0">
            <Modal.Header className="p-2">{modalTitle}</Modal.Header>
          </Col>
          <Col className={`col-2 text-end p-0 border-bottom`}>
            <Button
              variant={"danger"}
              className="p-0"
              onClick={() => {
                toggle();
              }}
            >
              <X size={25} />
            </Button>
          </Col>
        </Row>
        <Modal.Body>{formBody}</Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalForm;
