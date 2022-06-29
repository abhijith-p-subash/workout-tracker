import React, { useState, useEffect } from "react";
import {
  IonMenu,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonMenuToggle,
  useIonViewWillEnter,
  useIonViewDidEnter,
  IonAvatar,
  IonRow,
  IonCol,
} from "@ionic/react";
import { useHistory } from "react-router";

import { auth } from "../../firebase/FireBase-config";
import { signOut } from "firebase/auth";

import { MdHome } from "react-icons/md";
import { IoLogOut, IoPersonSharp } from "react-icons/io5";
import {
  golf,
  barChart,
  home,
  person,
  logOut,
  calculator,
} from "ionicons/icons";
import { Filter, Res, User } from "../../Models/Models";
import { getWithQuery } from "../../firebase/FireBase-services";

let user: User = {} as User;

const Menu = (props:any) => {
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [segment, setSegment] = useState("personal" || undefined);
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const history = useHistory();



  useIonViewDidEnter(() => {
    getUser();
  })
  

  const getUser = async () => {
    setShowLoader({ show: true, msg: "Loading..." });
    let filter: Filter[] = [
      { field: "uid", operator: "==", value: auth.currentUser?.uid || localStorage.getItem("uid") },
    ];
    const res: Res = await getWithQuery("users", filter,);


    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: User, index: number) => {
        user = { ...doc };
      });
      return user.name;
      
      setShowLoader({ show: false, msg: "" });
    }
  }

  const LogOut = async () => {
    try {
      const res = await signOut(auth);
      localStorage.removeItem("uid");
      localStorage.removeItem("accessToken");
      localStorage.setItem("auth", "false");
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <IonMenu
      swipeGesture
      side="start"
      menuId="m1"
      contentId="main"
      className="my-custom-menu "
    >
      <IonHeader>
        <IonToolbar color="primary">
        

          <IonItem color="primary">
            {/* <IonAvatar
              slot="start"
              className="ion-text-center ion-margin-vertical"
            >
              <img
                src="https://media-exp1.licdn.com/dms/image/C5603AQH5aKilFMvP-Q/profile-displayphoto-shrink_800_800/0/1643982067844?e=1660176000&v=beta&t=lmyABd8vEetuJsvVCRbVoUrdgMUBHBCMDmYZoQGrOzc"
                alt=""
              />
            </IonAvatar> */}
            <IonLabel>WORKOUT TRACKER</IonLabel>
          </IonItem>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
            <IonItem
              onClick={() => {
                history.push("/home");
              }}
            >
              <IonIcon className="ion-margin-end" icon={home}></IonIcon>
              <IonLabel className="ion-margin-start">Home</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem
              onClick={() => {
                history.push("/profile");
              }}
            >
              <IonIcon className=" ion-margin-end" icon={person}></IonIcon>
              <IonLabel className="ion-margin-start">Profile</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem
              onClick={() => {
                history.push("/bmi-calculator");
              }}
            >
              <IonIcon className=" ion-margin-end" icon={calculator}></IonIcon>
              <IonLabel className="ion-margin-start">BMI Calculator</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem
              onClick={() => {
                history.push("/progress");
              }}
            >
              <IonIcon className=" ion-margin-end" icon={barChart}></IonIcon>
              <IonLabel className="ion-margin-start">My Progress</IonLabel>
            </IonItem>
          </IonMenuToggle>
          {/* <IonMenuToggle>
            <IonItem onClick={() => { history.push("/login") }}>
            <IonIcon className=' ion-margin-end' icon={golf}></IonIcon>
              <IonLabel>Set My Goal</IonLabel>
            </IonItem>
          </IonMenuToggle> */}
          <IonMenuToggle>
            <IonItem
              onClick={() => {
                LogOut();
              }}
            >
              <IonIcon className=" ion-margin-end" icon={logOut}></IonIcon>
              <IonLabel className="ion-margin-start">Log Out</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
