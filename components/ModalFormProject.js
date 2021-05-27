import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FormProject from "./FormProject";

const ModalFormProject = (props) => {
  const { buttonLabel, className, onAddProject } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const { t, lang } = useTranslation("common");

  return (
    <div>
      <Button
        className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex"
        color="danger"
        onClick={toggle}
      >
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className} size={"lg"}>
        <ModalHeader toggle={toggle}>{t("FORM PROJECT")}</ModalHeader>
        <ModalBody>
          <FormProject onAddProject={onAddProject} toggle={toggle} />
        </ModalBody>
        <ModalFooter>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ModalFormProject;