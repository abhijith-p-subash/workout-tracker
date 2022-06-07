import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonMenuToggle, useIonViewWillEnter, useIonViewDidEnter, IonAvatar, IonRow, IonCol } from '@ionic/react';
import { useHistory } from "react-router";

import { auth } from "../../firebase/FireBase-config";
import { signOut } from "firebase/auth";

import { MdHome } from "react-icons/md";
import { IoLogOut, IoPersonSharp } from "react-icons/io5";
import {golf, barChart, home, person, logOut, calculator} from "ionicons/icons";


const Menu = () => {
  const history = useHistory();

  const LogOut = async () => {
    try {
      const res = await signOut(auth);
      localStorage.removeItem("uid");
      localStorage.removeItem("accessToken");
      localStorage.setItem("auth", 'false');
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <IonMenu swipeGesture side="start" menuId="m1" contentId='main' className="my-custom-menu "  >
      <IonHeader>
        <IonToolbar color="primary">
          {/* <IonRow>
            <IonCol>
            <IonAvatar>
            <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
          </IonAvatar>
            </IonCol>
            <IonCol>
            <IonTitle>Abhijith P Subash</IonTitle>
            </IonCol>
          </IonRow> */}


          <IonItem color="primary">
            <IonAvatar slot="start" className='ion-text-center ion-margin-vertical'>
              <img src="https://media-exp1.licdn.com/dms/image/C5603AQH5aKilFMvP-Q/profile-displayphoto-shrink_800_800/0/1643982067844?e=1660176000&v=beta&t=lmyABd8vEetuJsvVCRbVoUrdgMUBHBCMDmYZoQGrOzc" alt=""  />
              {/* <img src='http://cdn.onlinewebfonts.com/svg/img_264570.png' /> */}
              {/* <IonIcon size='large'  icon={personCircleOutline}></IonIcon> */}
            </IonAvatar>
            <IonLabel>Abhijith P Subash</IonLabel>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
            <IonItem onClick={() => { history.push("/home") }}>
               <IonIcon className=' ion-margin-end' icon={home}></IonIcon>
              <IonLabel>Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem onClick={() => { history.push("/profile") }}>
            <IonIcon className=' ion-margin-end' icon={person}></IonIcon>
              <IonLabel>Profile</IonLabel>
            </IonItem>
          </IonMenuToggle>  
          <IonMenuToggle>
            <IonItem onClick={() => { history.push("/profile") }}>
            <IonIcon className=' ion-margin-end' icon={calculator}></IonIcon>
              <IonLabel>Calculator</IonLabel>
            </IonItem>
          </IonMenuToggle>   
          <IonMenuToggle>
            <IonItem onClick={() => { history.push("/home") }}>
            <IonIcon className=' ion-margin-end' icon={barChart}></IonIcon>
              <IonLabel>My Progress</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem onClick={() => { history.push("/login") }}>
            <IonIcon className=' ion-margin-end' icon={golf}></IonIcon>
              <IonLabel>Set My Goal</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem onClick={() => { LogOut() }}>
            <IonIcon className=' ion-margin-end' icon={logOut}></IonIcon>
              <IonLabel>Log Out</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  )
}

export default Menu