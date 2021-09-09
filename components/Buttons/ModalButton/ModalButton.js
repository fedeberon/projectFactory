import React, { useState } from "react";
import { Trash, X } from "react-bootstrap-icons";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import useTranslation from "next-translate/useTranslation";
import { Button, Col, Modal, Row } from "react-bootstrap";

const ModalButton = (props) => {
  const {
    fullscreen,
    scrollable,
    size,
    modalTitle,
    modalBody,
  } = props;
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation("common");

  const toggle = () => setShowModal(!showModal);

  return (
    <>
      <PrimaryButton
        dark
        className={`position-absolute bottom-0 end-0 m-2`}
        type="button"
        onClick={toggle}
      >
        <Trash size={25} /> {t("delete")}
      </PrimaryButton>

      <Modal
        fullscreen={fullscreen}
        centered
        scrollable={scrollable}
        size={size}
        show={showModal}
        className={"Button"}
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
        <Modal.Body>{modalBody}</Modal.Body>
      </Modal>
    </>
  );
};

export default ModalButton;
