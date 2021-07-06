import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from "reactstrap";
import { X } from "react-bootstrap-icons";
const ModalForm = (props) => {
  const { className, modalTitle, formBody, modalOpen, size } = props;

  const toggle = () => modalOpen.function(!modalOpen.open);
  return (
    <div>
      <Modal
        centered
        size={size}
        isOpen={modalOpen.open}
        toggle={toggle}
        className={className}
      >
        <Row className="row m-2 px-2 pt-2">
          <Col className="col-10 p-0">
            <ModalHeader className="p-2">{modalTitle}</ModalHeader>
          </Col>
          <Col className={`col-2 text-end p-0 border-bottom`}>
            <Button
              color={"danger"}
              className="p-0"
              onClick={() => {
                toggle();
              }}
            >
              <X size={25} />
            </Button>
          </Col>
        </Row>
        <ModalBody>{formBody}</ModalBody>
      </Modal>
    </div>
  );
};

export default ModalForm;
