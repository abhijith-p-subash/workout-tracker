import React, {useState, useEffect} from 'react';
import {  IonHeader,IonTitle, IonToolbar, IonMenuButton, IonButtons } from '@ionic/react';



const Header = (props: any) => {
  const [showMenu, setShowMenu] = useState(true);

  // if (props.title === "Login" || props.title === "Register") {
  //   // setShowMenu(false);
  //   console.log("HEADER", props.title);
    
  // }

  useEffect(() => {
    if (props.title === "Login" || props.title === "Register") {
      setShowMenu(false);
    }
  } , [props.title]);
    
  
  return (
    <IonHeader>
        <IonToolbar  color='primary'>
          <IonTitle>{props.title}</IonTitle>
          {showMenu ?   <IonButtons  slot="start">
            <IonMenuButton menu='m1'></IonMenuButton>
            {/* <Menu/> */}
          </IonButtons> : null}
        </IonToolbar>
      </IonHeader>
  )
}

export default Header