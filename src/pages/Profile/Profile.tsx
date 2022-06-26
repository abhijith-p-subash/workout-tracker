import { IonCol, IonContent, IonPage, IonRow, IonTitle, IonToast, IonAvatar, IonItem, IonLabel, IonCard, IonButton, IonIcon, IonCardContent, IonText, IonSegment, IonSegmentButton, IonButtons, useIonViewWillEnter, IonMenuButton, IonHeader, IonToolbar, } from '@ionic/react'
import React, { useState } from 'react';


import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';
import { auth } from '../../firebase/FireBase-config';
import { getWithQuery } from "../../firebase/FireBase-services";


import "./Profile.css";
import { accessibility, barbell, bulb, calendarNumber, call, cameraOutline, create, fitness, locationOutline, mail, maleFemale, pencil, sync, water, closeCircle, checkmarkCircle, arrowRedo } from 'ionicons/icons';
import { Filter, GeneralData, Res, User } from '../../Models/Models';
import { useHistory } from "react-router";
import moment from 'moment';
import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
import { sendEmailVerification } from 'firebase/auth';

let user: User = {} as User;
let BMI: any = 0;

const Profile = () => {
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [segment, setSegment] = useState("personal" || undefined);
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [msg, setmsg] = useState({
    msg: "",
    color: "",
  });

  const history = useHistory();

  useIonViewWillEnter(() => {
    getUser()
  }, []);

  const getUser = async () => {
    setShowLoader({ show: true, msg: "Loading..." });
    let filter: Filter[] = [
      { field: "uid", operator: "==", value: auth.currentUser?.uid || localStorage.getItem("uid") },
    ];
    const res: Res = await getWithQuery("users", filter,);
    console.log(res);

    console.log(auth.currentUser)

    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: User, index: number) => {
        user = { ...doc };
      });
      if (user.weight && user.height) {
        BMI = (user.weight / ((user.height * user.height) / 10000)).toFixed(2)
      }

      if (BMI < 18.5) {
        setmsg({ msg: "You are underweight", color: "danger" });
      } else if (BMI >= 18.5 && BMI <= 24.9) {
        setmsg({ msg: "You are normal weight", color: "success" });
      } else {
        setmsg({ msg: "You are overweight", color: "danger" });
      }
      // setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  }



  return (
    <IonPage>
      <IonContent>
        {/* <Header title={"Profile"} /> */}
        <IonHeader>
          <IonToolbar color='primary'>
            <IonTitle>Profile</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton menu='m1'></IonMenuButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => history.push(`/update-profile/${user.id}`)} id="watch">
                <IonIcon icon={sync}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <Loader open={showLoader.show} msg={showLoader.msg} />
        <IonToast
          isOpen={showToast.show}
          onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
          message={showToast.msg}
          duration={1000}
          color={showToast.color}
        />
        <div className='ion-margin profileCard'>
          <IonCard color='light' >
            <div className='img-wrapper'>
              {/* <img src="https://media-exp1.licdn.com/dms/image/C5603AQH5aKilFMvP-Q/profile-displayphoto-shrink_800_800/0/1643982067844?e=1660176000&v=beta&t=lmyABd8vEetuJsvVCRbVoUrdgMUBHBCMDmYZoQGrOzc" alt="" />*/}
              <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.webp" alt="" />
              <IonButton color='light'>
                {auth.currentUser?.emailVerified ? <AiFillCheckCircle style={{ color: "rgb(0, 110, 255)" }} /> : <AiFillCloseCircle style={{ color: "red" }} />}
              </IonButton>
            </div>
            <IonCardContent className='ion-text-center'>
              <h2>{user.name}</h2>
              {BMI > 0 ? <IonLabel color={msg.color}>{msg.msg}</IonLabel> : null}
              <IonText color='medium'>
                <div className='ion-justify-content-center' style={{ display: 'flex' }}>
                  {auth.currentUser?.emailVerified ? <p>Verified</p> : <> <p>Please Verify Your Email</p> <IonIcon color='primary' className='ion-margin-start' size='small' icon={arrowRedo} ></IonIcon></>}
                </div>
              </IonText>
            </IonCardContent>
          </IonCard>

          <IonSegment value={segment} select-on-focus swipeGesture onIonChange={e => { setSegment(`${e.detail.value}`) }}>
            <IonSegmentButton value="personal">
              <IonLabel>PERSONAL</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="health">
              <IonLabel>HEALTH</IonLabel>
            </IonSegmentButton>
          </IonSegment>
          {segment === "personal" &&
            <div className='ion-margin-vertical'>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={mail} color="primary"></IonIcon>
                <IonLabel>{user.email ? user.email : "email"}</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={call} color="primary"></IonIcon>
                <IonLabel>{user.phone ? user.phone : "Phone Number"}</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={maleFemale} color="primary"></IonIcon>
                <IonLabel>{user.gender ? user.gender : "Gender"}</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={calendarNumber} color="primary"></IonIcon>
                <IonLabel>{user.dob ? moment(user.dob).format("L") : "Date of Birth"}</IonLabel>
              </IonItem>
            </div>}

          {segment === "health" &&
            <div className='ion-margin-vertical' color='medium'>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={bulb} color="primary"></IonIcon>
                <IonLabel>{BMI !== 0 ? user.age : "Age "} </IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={fitness} color="primary"></IonIcon>
                <IonLabel>{BMI !== 0 ? `${BMI} BMI (kg/cm^2)` : "BMI "} </IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={water} color="primary"></IonIcon>
                <IonLabel>{user.blood ? user.blood : "Blood Group "} </IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={accessibility} color="primary"></IonIcon>
                <IonLabel>{user.height ? user.height : "Height in "} cm</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={barbell} color="primary"></IonIcon>
                <IonLabel>{user.weight ? user.weight : "Weight in "}kg</IonLabel>
              </IonItem>
            </div>}

          {/* <IonRow className='ion-text-center'>
            <IonCol>
              <IonButton fill='outline'>UPDATE</IonButton>
            </IonCol>
          </IonRow> */}

        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile