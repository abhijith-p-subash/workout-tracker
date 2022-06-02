import { useState, useEffect } from "react";
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
  IonModal,
  IonButton,
  IonButtons,
  IonToolbar,
  IonHeader,
  IonList,
  IonPopover,
  IonSelect,
  IonSelectOption,
  IonToast,
  useIonViewWillEnter,
  useIonViewDidEnter,
  useIonPopover,
  IonMenuButton,
  IonDatetime,
  IonText
} from "@ionic/react";

import {
  add,
  ellipsisVertical,
  close,
  refresh,
  trashOutline,
  informationCircleOutline,
  chevronDownOutline,
  calendarNumberOutline,
  calendarOutline,
  stopwatchOutline
} from "ionicons/icons";

import { auth } from "../../firebase/FireBase-config";
import { useHistory } from "react-router";

import { IoAddSharp, IoClose } from "react-icons/io5";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import Tabs from "../../components/Tab/Tab";
import { wrkouts } from "../../assets/data/seed";
import { MyWorkOut, Res, Filter, AllWorkOut } from "../../Models/Models";
import {
  createDoc,
  getWithQuery,
  update,
  deleteOne,
  getAll
} from "../../firebase/FireBase-services";
import { Job, chunks, compare } from "../../Job/Job";
import moment from "moment";

import "./Home.css";


let myWrkOut: MyWorkOut[] = [];
let allWrkOut: AllWorkOut[] = [];
let dateFilter: string = moment().format();

const mySet: { weight: number; rep: number }[] = [];

const Home: React.FC = () => {


  const [addBtn, setAddBtn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [calenderCtrl, setCalenderCtrl] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [dataToAlert, setDataToAlert] = useState<MyWorkOut>();
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [popoverDate, setPopoverDate] = useState(moment().format());
  const history = useHistory();




  useIonViewWillEnter(() => {
    getData();
    getAllWrkOut();
  }, []);
  
  
  const getData = async () => {
    const UID = await localStorage.getItem("uid");
    myWrkOut = [];
    let filter: Filter[] = [
      { field: "uid", operator: "==", value: auth.currentUser?.uid || localStorage.getItem("uid") },
      { field: "date", operator: "==", value: moment(dateFilter).format("L") },
    ];

    setShowLoader({ show: true, msg: "Loading..." });
    const res: Res = await getWithQuery("myWorkOut", filter);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: MyWorkOut, index: number) => {
        myWrkOut.push(doc);
      });
      setShowModal(false);
      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }

  }

  const getAllWrkOut = async () => {
    allWrkOut = [];
    setShowLoader({ show: true, msg: "Loading..." });
    const res:Res = await getAll("exercises");
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: AllWorkOut, index: number) => {
        allWrkOut.push(doc);
      });

      console.log(allWrkOut);
      
      setShowModal(false);
      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }

    

  }

  const addWrkOut = async () => {
    setShowModal(!showModal);
    console.log(await deleteOne("myWorkOut", "Zkkj1MuBKXLvMy7e6y5e"));
    
  };

  const addWrkOutData = (data: MyWorkOut) => {
    setDataToAlert(data);
    setShowAlert(!showAlert);
  };


const deleteWrkOut = async (id:any) => {
  console.log(id);
  setShowLoader({ show: true, msg: "Deleting..." });
  const res: Res = await deleteOne("myWorkOut", id);
  if (res.error) {
    const err = JSON.parse(JSON.stringify(res.data));
    setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
    setShowLoader({ show: false, msg: "" });
  } else {
    getData();
    setShowToast({ show: true, msg: "Workout Deleted", color: "success" });
    setShowLoader({ show: false, msg: "" });
  }
}

  const selectDate = (ev: any) => {
    setCalenderCtrl(true);
    setPopoverDate(moment(ev.detail.value!).format());
    let a = dateFilter;
    dateFilter = ev.detail.value!;
    console.log(popoverDate);
    // if (ev.detail.value !== moment().format()) {
    //   setShowAddBtn(true);
    //   setShowLoader({ show: false, msg: "" });
    // }else{
    //   setShowAddBtn(false);
    //   setShowLoader({ show: false, msg: "" });
    // }
   
    if (ev.detail.value !== a) {
      getData();
    }

  }


  const selectWrkOut = async (
    event: any,
    bodyPart: string,
    partIndex: string
  ) => {
    setShowLoader({ show: true, msg: "Loading..." });
    let workout: MyWorkOut = {} as MyWorkOut,
      user = auth.currentUser;
  
    workout.uid = user?.uid;
    workout.bodyPartID = partIndex;
    workout.bodyPart = `${bodyPart}`;
    workout.workout = event.target.value;
    workout.set = [];
    workout.time = moment(dateFilter).format("LT");
    workout.createdAt = moment(dateFilter).format();
    workout.date = moment(dateFilter).format("L");

    const res = await createDoc("myWorkOut", workout);

    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      setShowModal(false);
      await getData();
      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage id="main">
      {/* <Header title="Home" /> */}
      <IonHeader>
        <IonToolbar color='primary'>
          <IonTitle>Home</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton menu='m1'></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => setCalenderCtrl(false)} id="open-date-input">
              <IonIcon icon={calendarOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={stopwatchOutline}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>


      <IonToast
        isOpen={showToast.show}
        onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
        message={showToast.msg}
        duration={1000}
        color={showToast.color}
      />
      <Loader open={showLoader.show} msg={showLoader.msg} />
      <IonContent className="content" fullscreen>


        {/* ****************CALENDER POPOVER **************************/}
        <IonPopover size="auto" side="left" alignment="center" trigger="open-date-input" dismissOnSelect={true} showBackdrop={true}>
          <IonDatetime
            presentation="date"
            onIonChange={(e) => { selectDate(e) }}
            value={dateFilter}
          />
        </IonPopover>
        {/* ****************CALENDER POPOVER **************************/}

        {/* ****************MODAL **************************/}
        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle>Body Parts</IonTitle>
              <IonButtons color="dark" slot="end">
                <IonButton onClick={() => setShowModal(false)}>CLOSE</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="content ion-padding" fullscreen>
            <div className="note">
              <IonList>
                {allWrkOut.map((item, index) => (
                  <IonItem className="moadlItem" key={index}>
                    <IonIcon slot="end" color="primary" name={close} />
                    <IonLabel  className="ion-text-capitalize">{item.bodyPart}</IonLabel>
                    <IonSelect
                      interface="popover"
                      placeholder="Select"
                      onIonChange={(e) => selectWrkOut(e, item.bodyPart, item.id)}
                    >
                      {item.workouts.map((wrkout, index) => (
                        <IonSelectOption className="ion-text-capitalize" value={wrkout.name} key={index}>
                          {wrkout.name}
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
          header={`${dataToAlert?.workout}`}
          subHeader={`${dataToAlert?.bodyPart}`}
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
              },
            },
            {
              text: "Add",
              id: "confirm-button",
              handler: async (data) => {
                mySet.push(data);
                let obj = myWrkOut.find(
                  (res) =>
                    res.bodyPart === dataToAlert?.bodyPart &&
                    res.workout === dataToAlert?.workout
                );
                dataToAlert?.set.push(data);
                await update("myWorkOut", dataToAlert?.id, dataToAlert);
              },
            },
          ]}
        />
        {/* ****************ALERT **************************/}

        {/* ****************POPOVER **************************/}
        {myWrkOut.map((item, index) => (
          <IonPopover
            trigger={item.id}
            dismissOnSelect={true}
          >
            <IonContent>
              <IonList>
                <IonItem onClick={()=> history.push(`/info/${item.workout}/${item.bodyPartID}`)} button={true} detail={false}>
                  <IonIcon icon={informationCircleOutline}></IonIcon>
                  <IonLabel className="ion-margin-start">Informaton</IonLabel>
                </IonItem>
                <IonItem button={true} detail={false}>
                  <IonIcon icon={refresh}></IonIcon>
                  <IonLabel className="ion-margin-start">Edit</IonLabel>
                </IonItem>
                <IonItem onClick={() => deleteWrkOut(item.id)} button={true} detail={false}>
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
                <IonLabel color="primary">{item.workout}</IonLabel>
                <IonLabel
                  className="ion-text-uppercase"
                  slot="end"
                  color="medium"
                >
                  {item.bodyPart}
                </IonLabel>
                <IonButtons slot="end">
                  <IonButton id={item.id}>
                    <IonIcon color="medium" icon={ellipsisVertical}></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonItem>
              <IonCardContent className="ion-justify-content-center">

                <IonRow>
                  {item.set.map((item, index) => (
                    <IonCol>
                      <div>
                        <h4 style={{ fontWeight: "bold" }}>SET {index + 1}</h4>
                        <h6>{item.weight} Kg</h6>
                        <h6>{item.rep} Rep</h6>
                      </div>
                    </IonCol>
                  ))}
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
          <IonFabButton disabled={showAddBtn} onClick={() => addWrkOut()}>
            <IonIcon icon={add} />
          </IonFabButton>
          {/* <IonFabList side="top">
          <IonLabel color="primary">ARM</IonLabel>
            <IonFabButton color="dark"><IonIcon icon={logoVimeo} /></IonFabButton>
          </IonFabList> */}
        </IonFab>
        {/* <Tabs/> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
function setShowActionSheet(arg0: boolean) {
  throw new Error("Function not implemented.");
}
