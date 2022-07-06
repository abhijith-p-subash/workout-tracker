import React, { useState } from "react";
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";

const Modal = (props: any) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <IonModal isOpen={showModal ? !showModal : props.showModal}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Modal</IonTitle>
          <IonButtons color="dark" slot="end">
            <IonButton>
              <IonIcon name={close}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <p>This is modal content</p>
      <IonButton onClick={() => setShowModal(true)}>Close Modal</IonButton>
    </IonModal>
  );
};

export default Modal;
