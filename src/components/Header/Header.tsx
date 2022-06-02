import React, { useState, useEffect } from 'react';
import { useIonViewWillEnter, IonHeader, IonTitle, IonToolbar, IonMenuButton, IonButtons, IonButton, IonIcon, useIonViewDidEnter } from '@ionic/react';
import {arrowBackOutline} from "ionicons/icons";
import { useHistory } from "react-router";



const Header = (props: any) => {
  const [showMenu, setShowMenu] = useState(true);
  const history = useHistory();

  useIonViewDidEnter(() => {
    if (props.title === "Login" || props.title === "Register") {
      setShowMenu(false);
    }
  }, [props.title]);


  return (
    <IonHeader>
      <IonToolbar color='primary'>
        <IonTitle>{props.title}</IonTitle>
        {showMenu ? <IonButtons slot="start">
          <IonMenuButton menu='m1'></IonMenuButton>
          {/* <Menu/> */}
        </IonButtons> : null}
        {/* {props.back ? <IonButtons slot='start'>
          <IonButton onClick={() => history.push(props.path)}>
            <IonIcon icon={arrowBackOutline}></IonIcon>
          </IonButton>
        </IonButtons> : null} */}
      </IonToolbar>
    </IonHeader>
  )
}

export default Header