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
    useIonViewDidLeave
} from "@ionic/react";

import Header from "../../components/Header/Header";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory, useParams } from "react-router";
import { AllWorkOut, Res, WorkOut } from "../../Models/Models";
import { getById } from "../../firebase/FireBase-services";
import Loader from "../../components/Loader/Loader";

let workoutData: AllWorkOut;
// let workout:WorkOut = {} as WorkOut;

const Info = () => {
    const [workout, setWorkout] = useState<WorkOut>({} as WorkOut);
    const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
    const [showToast, setShowToast] = useState({
      show: false,
      msg: "",
      color: "",});
    const [player, setPlayer] = useState();
    const ID:{id:string, wrkout:string} = useParams();
    const history = useHistory();

    console.log(ID.id);
    console.log(ID.wrkout);

    useEffect(() => {
        getWorkOut(ID);
    } , []);


    useIonViewDidEnter(() => {
       getWorkOut(ID);
      }, []);

      
  useIonViewWillEnter(() => {
    getWorkOut(ID);
  }, []);


    const getWorkOut = async (ID:{id:string, wrkout:string}) => {
        setShowLoader({ show: true, msg: "Loading..." });
        const res:Res = await getById("exercises", ID.id);
        if (res.error) {
          const err = JSON.parse(JSON.stringify(res.data));
          setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
          setShowLoader({ show: false, msg: "" });
        } else {
         console.log(res.data.data());
            await search(ID.wrkout, res.data.data().workouts);
          setShowToast({ show: true, msg: "Workout Added", color: "success" });
          setShowLoader({ show: false, msg: "" });
        }
        
    }

    const search = async (nameKey:string, myArray:WorkOut[]) => {
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].name === nameKey) {
              await setWorkout(myArray[i]);
              console.log(workout);
              
            }
        }
    }


    return (
        <>
            {/* <IonPage>
                <IonContent>
                <Loader open={showLoader.show} msg={showLoader.msg} />
                    <IonHeader>
                        <IonToolbar color="primary">
                            <IonTitle> Info </IonTitle>
                            <IonButtons slot="start">
                                <IonButton href="/home" onClick={() => {setWorkout({} as WorkOut)}}>
                                    <IonIcon icon={arrowBackOutline}></IonIcon>
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <div>
                        <IonRow className="ion-padding">
                            <IonTitle>{workout.name}</IonTitle>
                        </IonRow>
                        <IonRow>
                            <IonCol className="ion-padding">
                                {workout.description}
                            </IonCol>
                        </IonRow>
                        <IonRow className="ion-padding">
                            <iframe
                                className="webPage"
                                loading="lazy"
                                width="560"
                                height="315"
                                src={workout.url}
                                title="YouTube video player"
                                allow="accelerometer clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen={true}
                            ></iframe>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage> */}
        </>
    );
};

export default Info;
