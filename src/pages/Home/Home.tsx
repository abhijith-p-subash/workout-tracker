import { useState } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonItem,
  IonLabel,
  IonCardContent,
  IonRow,
  IonCol,
  IonAlert,
  IonInput,
  IonFabList,
  IonModal,
  IonButton,
  IonActionSheet,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonList,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonPopover,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";

import {
  add,
  barbell,
  ellipsisVertical,
  close,
  closeCircle,
  refresh,
  trashOutline,
  logoYoutube,
  informationCircleOutline,
} from "ionicons/icons";

import {auth} from "../../firebase/FireBase-config"

import { IoAddSharp, IoClose } from "react-icons/io5";
import Header from "../../components/Header/Header";
import { wrkouts } from "../../assets/data/seed";
import { MyWorkOut } from "../../Models/Models";
import { createDoc, createDocCustomID, getAll,getById } from "../../firebase/FireBase-services";
import "./Home.css";

const myWrkOut: MyWorkOut[] = [];
const mySet:{weight:number,rep:number}[] =[];

const Home: React.FC = () => {
  const [addBtn, setAddBtn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [wrkout, setWrkOut] = useState({ bodyPart: "", wrkout: "" });
  const [dataToAlert, setDataToAlert] = useState({ bodyPart: "", wrkout: "" });

  const addWrkOut = async () => {
    // setAddBtn(!addBtn);
    // setShowActionSheet(!showActionSheet);
    setShowModal(!showModal);
    console.log( auth.currentUser);
    const user = await getAll("users");
    console.log(user);

//const cuId = await createDocCustomID("leg", "exercises",{ workOuts:["leg 01"]});


  };

  const addWrkOutData = (data:any) => {
    setDataToAlert(data);
    setShowAlert(!showAlert);
  };

  const modalClick = (item: string, index: number) => {
    console.log(item, index);
  };

  const selectWrkOut = (event: any, bodyPart: string, partIndex: number) => {
    console.log(event);
    console.log(event.target.value, bodyPart, partIndex);
    myWrkOut.push({ bodyPart: bodyPart, wrkout: event.target.value, set:[] });
    setShowModal(false);
    console.log(myWrkOut);
  };

  return (
    <IonPage id="main">
      <Header title="Home" />
      <IonContent className="content" fullscreen>
        {/* ****************MODAL **************************/}
        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Body Parts</IonTitle>
              <IonButtons color="dark" slot="end">
                <IonButton onClick={() => setShowModal(false)}>ADD</IonButton>
                <IonButton onClick={() => setShowModal(false)}>CLOSE</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="content ion-padding" fullscreen>
            <div className="note">
              <IonList>
                {wrkouts.map((item, index) => (
                  <IonItem className="moadlItem" key={index}>
                    <IonIcon slot="end" color="primary" name={close} />
                    <IonLabel>{item.name}</IonLabel>
                    <IonSelect
                      interface="popover"
                      placeholder="Select"
                      onIonChange={(e) => selectWrkOut(e, item.name, index)}
                    >
                      {item.workoutName.map((wrkout, index) => (
                        <IonSelectOption value={wrkout} key={index}>
                          {wrkout}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </IonContent>
        </IonModal>
        {/* ****************MODAL **************************/}

        {/* ****************ALERT **************************/}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            setAddBtn(false);
          }}
          cssClass="my-custom-class"
          header={`${dataToAlert.wrkout}`}
          subHeader={`${dataToAlert.bodyPart}`}
          inputs={[
            {
              name: "weight",
              type: "number",
              placeholder: "10 Kg",
              label: "Weight",
            },
            {
              name: "rep",
              type: "number",
              placeholder: "15 Rep",
              label: "Weight",
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: (blah) => {
                console.log("Confirm Cancel: blah");
              },
            },
            {
              text: "Add",
              id: "confirm-button",
              handler: (data) => {
                console.log("Confirm Okay");
                console.log(data);
                mySet.push(data);
                let obj = myWrkOut.find(res => (res.bodyPart === dataToAlert.bodyPart && res.wrkout === dataToAlert.wrkout));
                obj?.set.push(data);
                console.log(obj);
              },
            },
          ]}
        />
        {/* ****************ALERT **************************/}

        {/* ****************POPOVER **************************/}
        {myWrkOut.map((item, index) => (
          <IonPopover
            trigger={item.bodyPart + item.wrkout}
            dismissOnSelect={true}
          >
            <IonContent>
              <IonList>
                <IonItem button={true} detail={false}>
                  <IonIcon icon={informationCircleOutline}></IonIcon>
                  <IonLabel className="ion-margin-start">Informaton</IonLabel>
                </IonItem>
                <IonItem button={true} detail={false}>
                  <IonIcon icon={refresh}></IonIcon>
                  <IonLabel className="ion-margin-start">Edit</IonLabel>
                </IonItem>
                <IonItem button={true} detail={false}>
                  <IonIcon icon={trashOutline}></IonIcon>
                  <IonLabel className="ion-margin-start">Delete</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        ))}
        {/* ****************POPOVER **************************/}
        <div className="note">
          {myWrkOut.map((item, index) => (
            <IonCard className="ion-margin-vertical">
              <IonItem className="ion-activated">
                <IonLabel color="primary">{item.wrkout}</IonLabel>
                <IonLabel
                  className="ion-text-uppercase"
                  slot="end"
                  color="medium"
                >
                  {item.bodyPart}
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton id={item.bodyPart + item.wrkout}>
                    <IonIcon color="medium" icon={ellipsisVertical}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonItem>
              <IonCardContent className="ion-justify-content-center">
                <IonRow>
                  {item.set.map((item, index) => (
                     <IonCol>
                     <div>
                       <h4 style={{fontWeight:"bold"}}>SET {index+1}</h4>
                       <h6>{item.weight} Kg</h6>
                       <h6>{item.rep} Rep</h6>
                     </div>
                   </IonCol>))}
                </IonRow>

                <IonRow className="ion-float-right">
                  <IonCol onClick={() => addWrkOutData(item)}>
                    <IoAddSharp size={25} />
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          ))}
        </div>
        <IonFab
          vertical="bottom"
          activated={addBtn}
          horizontal="end"
          slot="fixed"
        >
          <IonFabButton onClick={() => addWrkOut()}>
            <IonIcon icon={add} />
          </IonFabButton>
          {/* <IonFabList side="top">
          <IonLabel color="primary">ARM</IonLabel>
            <IonFabButton color="dark"><IonIcon icon={logoVimeo} /></IonFabButton>
          </IonFabList> */}
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Home;
function setShowActionSheet(arg0: boolean) {
  throw new Error("Function not implemented.");
}
