import {
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonPage,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
  IonCardContent,
  useIonViewWillEnter,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCardHeader,
  IonButtons,
  IonIcon
} from "@ionic/react";
import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";

import { useHistory } from "react-router";
import { auth } from "../../firebase/FireBase-config";
import { arrowBackCircleOutline, arrowBackOutline } from "ionicons/icons";
import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";

const RestPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const history = useHistory();


  const handleChange = (event: any) => {
   setEmail(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
        setShowLoader({ show: true, msg: "Sending" });
        await sendPasswordResetEmail(auth, email);
        setEmail("");
        setShowLoader({ show: false, msg: "" });
        setShowToast({show: true, msg: "Verification email sent", color: "success"});
        history.push("/login");
    } catch (error) {
        const err = JSON.parse(JSON.stringify(error))
        setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
        setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage id="main">
      <IonHeader>
        <IonToolbar color="primary">
            <IonButtons slot="start">
                <IonButton onClick={() => history.push("/login")}> <IonIcon  icon={arrowBackOutline}></IonIcon> </IonButton>
            </IonButtons>
          {/* <IonTitle>Rest Password</IonTitle> */}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-margin">
        <IonToast
          isOpen={showToast.show}
          onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
          message={showToast.msg}
          duration={1000}
          color={showToast.color}
        />
        <Loader open={showLoader.show} msg={showLoader.msg} />
        <IonCard>
            <IonCardHeader>
                <IonTitle className="ion-text-center" >Reset Password</IonTitle>
            </IonCardHeader>
          <IonCardContent className="ion-text-center ion-padding">
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="text"
                onIonChange={(e) => handleChange(e)}
                value={email}
              ></IonInput>
            </IonItem>
            <IonRow className="ion-margin-vertical">
              <IonCol>
                <IonButton
                  type="submit"
                  onClick={(e) => handleSubmit(e)}
                  color="primary"
                >
                  Send Verfication Email
                </IonButton>
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default RestPassword;
