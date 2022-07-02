import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  IonLabel,
  IonList,
  IonItem,
  IonInput,
  IonButton,
  IonImg,
  IonToast,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonButtons,
  IonIcon,
  useIonViewWillEnter,
  useIonViewDidEnter,
  useIonViewDidLeave,
  IonCard,
  IonCardContent,
} from "@ionic/react";

import Header from "../../components/Header/Header";
import { arrowBackOutline, pin, pulse } from "ionicons/icons";
import { useHistory, useParams } from "react-router";
import { AllWorkOut, Res, WorkOut } from "../../Models/Models";
import { getById } from "../../firebase/FireBase-services";
import Loader from "../../components/Loader/Loader";
import { capitalize } from "../../Util/Util";

let workoutData: AllWorkOut;
let workout: WorkOut = {} as WorkOut;

const Info = () => {
  //   const [workout, setWorkout] = useState<WorkOut>({} as WorkOut);
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [player, setPlayer] = useState();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();



  useIonViewWillEnter(() => {
    let link = window.location.href.split('/')
    getWorkOut(link[link.length - 1]);
  }, []);

 

  useIonViewDidLeave(()=>{
    workout = {} as WorkOut;
  })
  const getWorkOut = async (id:string) => {
    setShowLoader({ show: true, msg: "Loading..." });
    const res: Res = await getById("exercises", id);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {


      workout = res.data;

      console.log(workout);
      
      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });

    }
  };


  return (
    <>
      <IonPage>
        <IonContent>
          <Loader open={showLoader.show} msg={showLoader.msg} />
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle> Info </IonTitle>
              <IonButtons slot="start">
                <IonButton
                  onClick={() => {
                    workout = {} as WorkOut;
                    history.push("/home");
                  }}
                >
                  <IonIcon icon={arrowBackOutline}></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <div>
            <IonCard className="ion-margin-vertical">
              <IonItem>
                <IonIcon icon={pulse} slot="start" color="primary" />
                <IonLabel color="medium" className="ion-text-uppercase" >{workout.name}</IonLabel>
              </IonItem>

              <IonCardContent>
                <IonRow>
                    <IonCol sizeSm="6"><IonLabel color="medium" className="ion-text-uppercase">Body-Part:</IonLabel></IonCol>
                    <IonCol sizeSm="6"><IonLabel color="dark" className="ion-text-capitalize">{workout.bodyPart}</IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol sizeSm="6"><IonLabel color="medium" className="ion-text-uppercase">Targeted Muscle:</IonLabel></IonCol>
                    <IonCol sizeSm="6"><IonLabel color="dark" className="ion-text-capitalize">{workout.target}</IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol sizeSm="6"><IonLabel color="medium" className="ion-text-uppercase">Equipment:</IonLabel></IonCol>
                    <IonCol sizeSm="6"><IonLabel color="dark" className="ion-text-capitalize">{workout.equipment}</IonLabel></IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                    <div>
                           <IonImg src={workout.url}/>
                    </div>
                </IonRow>
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Info;
