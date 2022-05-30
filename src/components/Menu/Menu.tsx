import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle } from '@ionic/react';
import { useHistory } from "react-router";

import {auth} from "../../firebase/FireBase-config";
import {signOut} from "firebase/auth";

import { MdHome } from "react-icons/md";
import { IoLogOut, IoPersonSharp } from "react-icons/io5";


const Menu = () => {
  const history = useHistory();

  const LogOut= async () => {
    try {
      console.log("sign out");
      const res = await signOut(auth);
      history.push("/login");
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <IonMenu swipeGesture  side="start" menuId="m1" contentId='main' className="my-custom-menu "  >
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
          <IonItem onClick={()=>{history.push("/home")}}>
            <div style={{ marginRight: 10 }}>
              <MdHome size={25} />
            </div>
            <IonLabel>Home</IonLabel>
          </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
          <IonItem  onClick={()=>{history.push("/profile")}}>
            <div style={{ marginRight: 10 }}>
              <IoPersonSharp size={25} />
            </div>
            <IonLabel>Profile</IonLabel>
          </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
          <IonItem  onClick={()=>{history.push("/login")}}>
            <div style={{ marginRight: 10 }}>
              <IoPersonSharp size={25} />
            </div>
            <IonLabel>Profile</IonLabel>
          </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
          <IonItem onClick={()=>{LogOut()}}>
            <div style={{ marginRight: 10 }}>
              <IoLogOut size={25} />
            </div>
            <IonLabel>Log Out</IonLabel>
          </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}

export default Menu