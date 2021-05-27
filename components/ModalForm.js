import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
const ModalForm = (props) => {

    const {
      className,
      modalTitle,
      formBody,
      modalOpen
    } = props;
    
    const toggle = () => modalOpen.function(!modalOpen.open);

    return (
        <div>
          <Modal isOpen={modalOpen.open} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
            <ModalBody>
                {formBody}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={toggle}>Do Something</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      );
    }


export default ModalForm