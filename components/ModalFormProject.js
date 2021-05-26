import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import FormProject from './FormProject';

const ModalFormProject = (props) => {

    const {
        buttonLabel,
        className,
        onAddProfessional
      } = props;
    
    const [modal, setModal] = useState(false);
    
    const toggle = () => setModal(!modal);

    return (
        <div>
          <Button className="position-fixed bottom-0 end-0 me-3 mb-3 rounded-circle zIndex" color="danger" onClick={toggle}>{buttonLabel}</Button>
          <Modal isOpen={modal} toggle={toggle} className={className}>
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
                <FormProject onAddProfessional={onAddProfessional} toggle={toggle} />
            </ModalBody>
          </Modal>
        </div>
      );
    }


export default ModalFormProject