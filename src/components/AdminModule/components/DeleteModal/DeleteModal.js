import React from "react";
import Modal from "./Modal";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";
import { Button } from "react-bootstrap";

export default function DeleteModal(props) {
  return (

    <Modal>
      <ModalHeader>
        <h3>Delete {props.componentName}</h3>
      </ModalHeader>
      <ModalBody>
        <p>Are you sure to Delete this {props.componentName}?</p>
      </ModalBody>
      <ModalFooter>
        {/* <Button variant="secondary" onClick={props.close}>
          Close
        </Button> */}
        <Button variant="secondary" onClick={props.handleState}>
          Close
        </Button>
        <Button variant="danger" onClick={props.handleDeleteSubmit}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
}