import { useState, useEffect, useRef } from "react";
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
  IonText,
  IonFabList,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonCardHeader,
  IonCardSubtitle,
  IonAvatar,
  IonSearchbar,
  IonImg,
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
  stopwatchOutline,
  play,
  pause,
  timer,
  hourglass,
  timerOutline,
  hourglassOutline,
  stop,
  logoVimeo,
  swapHorizontal,
  pulse,
  arrowBack,
} from "ionicons/icons";

import { auth } from "../../firebase/FireBase-config";
import { useHistory } from "react-router";

import { IoAddSharp, IoClose } from "react-icons/io5";
import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import Tabs from "../../components/Tab/Tab";
import { wrkouts } from "../../assets/data/seed";
import {
  MyWorkOut,
  Res,
  Filter,
  AllWorkOut,
  Set,
  OrderBy,
  User,
  MyWeight,
  WorkOut,
} from "../../Models/Models";
import {
  createDoc,
  getWithQuery,
  update,
  deleteOne,
  getAll,
  getWithQueryOrder,
} from "../../firebase/FireBase-services";
import { Job, chunks, compare } from "../../Job/Job";
import moment from "moment";
import Axios from "../../Axios/Axios";
import { bodyPart } from "../../Seeder/BodyPart";
import { capitalize } from "../../Util/Util";

import "./Home.css";
import { Timestamp } from "firebase/firestore";

let user: User = {} as User;
let myWrkOut: MyWorkOut[] = [];
let myWeight: MyWeight = {} as MyWeight;
let allWrkOut: WorkOut[] = [];
let dateFilter: string = moment().format();
let BMI: any = 0;

const mySet: { weight: number; rep: number }[] = [];

const Home: React.FC = () => {
  const [addBtn, setAddBtn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showGoalAlert, setShowGoalAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [calenderCtrl, setCalenderCtrl] = useState(false);
  const [showAddBtn, setShowAddBtn] = useState(false);
  const [dataToAlert, setDataToAlert] = useState<MyWorkOut>();
  const [showAlert3, setShowAlert3] = useState(false);
  const [setDelData, setSetDelData] = useState({
    index: 0,
    set: {} as Set,
    wrkout: {} as MyWorkOut,
  });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [popoverDate, setPopoverDate] = useState(moment().format());
  const [watch, setWatch] = useState({ ctrl: false, type: "" });
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const countRef = useRef(0);
  const [msg, setmsg] = useState({ msg: "", color: "" });
  const [goal, setGoal] = useState(0);
  const [openWrkOut, setOpenWrkOut] = useState(false);
  const [searchText, setSearchText] = useState("");
  const history = useHistory();

  useIonViewWillEnter(() => {
    getData();
    getUser();
    getCurrentWeight();
  }, []);

  const getUser = async () => {
    setShowLoader({ show: true, msg: "Loading..." });
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
    ];
    const res: Res = await getWithQuery("users", filter);

    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: User, index: number) => {
        user = { ...doc };
      });
      if (user.weight && user.height) {
        BMI = (user.weight / ((user.height * user.height) / 10000)).toFixed(2);
      }

      if (BMI < 18.5) {
        setmsg({ msg: "underweight", color: "danger" });
      } else if (BMI >= 18.5 && BMI <= 24.9) {
        setmsg({ msg: "normal weight", color: "success" });
      } else {
        setmsg({ msg: "overweight", color: "danger" });
      }
      setGoal(user.height ? user.height - 100 : 0);
      // setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  const getData = async () => {
    const UID = await localStorage.getItem("uid");
    myWrkOut = [];
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
      { field: "date", operator: "==", value: moment(dateFilter).format("L") },
    ];

    let orderBy: OrderBy = {
      field: "createdAt",
      direction: "desc",
    };

    setShowLoader({ show: true, msg: "Loading..." });
    const res: Res = await getWithQueryOrder("myWorkOut", filter, orderBy);

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
  };

  const getAllWrkOut = async (part: string) => {
    allWrkOut = [];
    setShowLoader({ show: true, msg: "Loading..." });
    let filter = [{ field: "bodyPart", operator: "==", value: part }];
    const res: Res = await getWithQuery("exercises", filter);

    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: WorkOut, index: number) => {
        allWrkOut.push(doc);
      });

      setOpenWrkOut(true);
      // setShowModal(false);
      // setShowToast({ show: true, msg: "", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  const addWrkOut = async () => {
    allWrkOut = [];
    setOpenWrkOut(false);
    setShowModal(!showModal);
  };

  const addWrkOutData = (data: MyWorkOut) => {
    setDataToAlert(data);
    setShowAlert(!showAlert);
  };

  const editSets = async (data: MyWorkOut) => {
    setDataToAlert(data);
    setShowAlert(!showAlert);
  };

  const deleteWrkOut = async (id: any) => {
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
  };

  const selectDate = (ev: any) => {
    setCalenderCtrl(true);
    setPopoverDate(moment(ev.detail.value!).format());
    let a = dateFilter;
    dateFilter = ev.detail.value!;
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
  };

  const selectWrkOut = async (
    // event: any,
    // bodyPart: string,
    // partIndex: string
    wrk: WorkOut
  ) => {
    setShowLoader({ show: true, msg: "Loading..." });
    let workout: MyWorkOut = {} as MyWorkOut,
      user = auth.currentUser;

    workout.uid = user?.uid;
    // workout.bodyPartID = partIndex;
    // workout.bodyPart = `${bodyPart}`;
    // workout.workout = event.target.value;
    workout.workout = wrk;
    workout.set = [];
    workout.time = moment(dateFilter).format("LT");
    // workout.createdAt = new Date(dateFilter);
    // workout.createdAt = moment(dateFilter).format();
    workout.createdAt = Timestamp.fromDate(new Date(dateFilter));
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

  const watchCtrl = (ctrl: boolean, type: string) => {
    setIsPlaying(false);
    setWatch({ ctrl: ctrl, type: type });
  };

  const handleStart = () => {
    setIsPlaying(true);
    //   if (watch.ctrl && watch.type === "stop" && isPlaying) {
    //     countRef.current = setInterval(() => {
    //       setTime((timer) => timer + 1);
    //     }, 1000);
    //   }

    // }
  };

  const deleteSet = async (items: MyWorkOut, item: Set, index: number) => {
    setShowAlert3(true);
    setSetDelData({
      set: item,
      index: index,
      wrkout: items,
    });
  };

  const getCurrentWeight = async () => {
    setShowLoader({ show: true, msg: "Loading..." });
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
      { field: "date", operator: "==", value: moment().format("L") },
    ];
    const res: Res = await getWithQuery("myWeight", filter);

    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: MyWeight, index: number) => {
        myWeight = { ...doc };
      });
      // setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage id="main">
      {/* <Header title="Home" /> */}
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Home</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton menu="m1"></IonMenuButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={() => setCalenderCtrl(false)}
              id="open-date-input"
            >
              <IonIcon icon={calendarOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton id="watch">
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
        <IonPopover
          size="auto"
          side="left"
          alignment="center"
          trigger="open-date-input"
          dismissOnSelect={true}
          showBackdrop={true}
        >
          <IonDatetime
            presentation="date"
            onIonChange={(e) => {
              selectDate(e);
            }}
            value={dateFilter}
          />
        </IonPopover>
        {/* ****************CALENDER POPOVER **************************/}

        {/* ****************MODAL **************************/}
        <IonModal isOpen={showModal}>
          <IonHeader>
            <IonToolbar color="primary">
              {allWrkOut.length === 0 && !openWrkOut ? (
                <IonTitle>Body Parts</IonTitle>
              ) : (
                <>
                  <IonTitle>Work-Outs</IonTitle>{" "}
                  <IonButtons color="dark" slot="start">
                    <IonButton
                      onClick={() => {
                        allWrkOut = [];
                        setOpenWrkOut(false);
                      }}
                    >
                      {" "}
                      <IonIcon icon={arrowBack}></IonIcon>{" "}
                    </IonButton>
                  </IonButtons>
                </>
              )}

              <IonButtons color="dark" slot="end">
                <IonButton onClick={() => setShowModal(false)}>CLOSE</IonButton>
              </IonButtons>
            </IonToolbar>
            {allWrkOut.length === 0 && !openWrkOut ? null : (
              <IonToolbar color="primary">
                <IonSearchbar
                  value={searchText}
                  onIonChange={(e) => setSearchText(e.detail.value!)}
                  animated
                ></IonSearchbar>
              </IonToolbar>
            )}
          </IonHeader>
          <IonContent className="content ion-padding" fullscreen>
            {allWrkOut.length === 0 && !openWrkOut ? (
              <div className="note">
                <IonList>
                  {bodyPart.map((part, index) => (
                    <IonItem key={index} onClick={() => getAllWrkOut(part)}>
                      <IonIcon icon={pulse} color="primary"></IonIcon>
                      <IonLabel className="ion-margin-start">
                        {capitalize(part)}
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </div>
            ) : (
              <div>
                   <IonItem > <IonLabel className="ion-text-center" color="medium" >SWIPE LEFT OR RIGHT </IonLabel></IonItem>
                <IonList>
              
                  {allWrkOut
                    .filter((val) => {
                      if (searchText === "") {
                        return val;
                      } else if (
                        val.name
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      ) {
                        return val;
                      } else if (
                        val.equipment
                          .toLowerCase()
                          .includes(searchText.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .map((wrk, index) => (
                      <IonItemSliding key={wrk.id}>
                        <IonItemOptions side="start">
                          <IonItemOption
                            color="danger"
                            onClick={() => {history.push(`/info/${wrk.id}`);setShowModal(false);}}
                          >
                            info
                          </IonItemOption>
                        </IonItemOptions>

                        <IonItem key={index} >
                          <IonAvatar slot="start">
                        
                            <IonImg src={wrk.url} />
                          </IonAvatar>
                          <IonLabel className="ion-margin-start">
                            {capitalize(wrk.name)}
                          </IonLabel>
                        </IonItem>

                        <IonItemOptions side="end">
                          <IonItemOption
                             onClick={() => selectWrkOut(wrk)}
                          >
                            ADD
                          </IonItemOption>
                        </IonItemOptions>
                      </IonItemSliding>
                    ))}
                </IonList>
              </div>
            )}
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
          header={`${dataToAlert?.workout.name}`}
          subHeader={`${dataToAlert?.workout.bodyPart}`}
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
              handler: (blah) => {},
            },
            {
              text: "Add",
              id: "confirm-button",
              handler: async (data) => {
                mySet.push(data);
                let obj = myWrkOut.find(
                  (res) =>
                    res.workout.bodyPart === dataToAlert?.workout.bodyPart &&
                    res.workout.name === dataToAlert?.workout.name
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
          <IonPopover key={index} trigger={item.id} dismissOnSelect={true}>
            <IonContent>
              <IonList>
                <IonItem
                  // onClick={() =>
                  //   history.push(`/info/${item.workout.id}`)
                  // }
                  routerLink={`/info/${item.workout.id}`}
                  routerDirection="forward"
                  button={true}
                  detail={false}
                >
                  <IonIcon icon={informationCircleOutline}></IonIcon>
                  <IonLabel className="ion-margin-start">Informaton</IonLabel>
                </IonItem>
                {/* <IonItem button={true} detail={false}>
                  <IonIcon icon={refresh}></IonIcon>
                  <IonLabel className="ion-margin-start">Edit</IonLabel>
                </IonItem> */}
                <IonItem
                  onClick={() => deleteWrkOut(item.id)}
                  button={true}
                  detail={false}
                >
                  <IonIcon icon={trashOutline}></IonIcon>
                  <IonLabel className="ion-margin-start">Delete</IonLabel>
                </IonItem>
              </IonList>
            </IonContent>
          </IonPopover>
        ))}
        {/* ****************POPOVER **************************/}

        {/* ****************WATCH POPOVER **************************/}
        <IonPopover trigger="watch" dismissOnSelect={true}>
          <IonContent>
            <IonList>
              <IonItem
                onClick={() => watchCtrl(true, "stop")}
                button={true}
                detail={false}
              >
                <IonIcon icon={timerOutline}></IonIcon>
                <IonLabel className="ion-margin-start">Stop Watch</IonLabel>
              </IonItem>
              <IonItem
                onClick={() => watchCtrl(true, "counter")}
                button={true}
                detail={false}
              >
                <IonIcon icon={hourglassOutline}></IonIcon>
                <IonLabel className="ion-margin-start">Count Down</IonLabel>
              </IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
        {/* ****************WATCH POPOVER **************************/}

        {/* ****************GOAL ALERT **************************/}
        <IonAlert
          isOpen={showGoalAlert}
          onDidDismiss={() => {
            setShowGoalAlert(false);
            setAddBtn(false);
          }}
          cssClass="my-custom-class"
          header="Current Weight"
          subHeader={`${moment().format("L")}`}
          inputs={[
            {
              name: "weight",
              type: "number",
              placeholder: "10 Kg",
              label: "Weight",
            },
          ]}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: (blah) => {},
            },
            {
              text: "Add",
              id: "confirm-button",
              handler: async (data) => {
                setShowLoader({ show: true, msg: "Loading..." });
                const res = await createDoc("myWeight", {
                  uid: auth.currentUser?.uid,
                  weight: data.weight,
                  date: moment().format("L"),
                  createdAt: moment().format(),
                });

                if (res.error) {
                  const err = JSON.parse(JSON.stringify(res.data));
                  setShowToast({
                    show: true,
                    msg: `${err.code}`,
                    color: "danger",
                  });
                  setShowLoader({ show: false, msg: "" });
                } else {
                  getCurrentWeight();
                  setShowToast({
                    show: true,
                    msg: "Workout Added",
                    color: "success",
                  });
                  setShowLoader({ show: false, msg: "" });
                }
              },
            },
          ]}
        />

        {/* ****************GOAL ALERT**************************/}

        {/* **************** SET DELETE ALERT **************************/}
        <IonAlert
          isOpen={showAlert3}
          onDidDismiss={() => setShowAlert3(false)}
          cssClass="my-custom-class"
          header={`Delete !`}
          message={`SET 0${setDelData.index + 1}`}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
              id: "cancel-button",
              handler: (blah) => {},
            },
            {
              text: "Confirm",
              id: "confirm-button",
              handler: async () => {
                setShowLoader({ show: true, msg: "Deleting..." });
                if (setDelData.index > -1) {
                  setDelData.wrkout.set.splice(setDelData.index, 1);
                }

                const res: Res = await update(
                  "myWorkOut",
                  setDelData.wrkout.id,
                  setDelData.wrkout
                );
                if (res.error) {
                  const err = JSON.parse(JSON.stringify(res.data));
                  setShowToast({
                    show: true,
                    msg: `${err.code}`,
                    color: "danger",
                  });
                  setShowLoader({ show: false, msg: "" });
                } else {
                  getData();
                  setShowToast({
                    show: true,
                    msg: "Updated",
                    color: "success",
                  });
                  setShowLoader({ show: false, msg: "" });
                }
              },
            },
          ]}
        />

        {/* **************** SET DELETE ALERT **************************/}

        {watch.ctrl ? (
          <div className="timer-root ion-margin">
            <IonCard color="light">
              <IonCardContent>
                <IonRow>
                  <IonCol size="6" className="ion-text-center">
                    <IonTitle>01:10:00</IonTitle>
                  </IonCol>
                  <IonCol size="2">
                    <IonButtons>
                      <IonButton>
                        <IonIcon
                          size="small"
                          icon={watch.type === "stop" ? stop : add}
                        ></IonIcon>
                      </IonButton>
                    </IonButtons>
                  </IonCol>
                  <IonCol size="2">
                    <IonButtons>
                      <IonButton onClick={() => setIsPlaying(!isPlaying)}>
                        <IonIcon
                          size="small"
                          icon={isPlaying ? pause : play}
                        ></IonIcon>
                      </IonButton>
                    </IonButtons>
                  </IonCol>
                  <IonCol size="2">
                    <IonButtons>
                      <IonButton
                        onClick={() => {
                          setWatch({ ctrl: false, type: "" });
                          setIsPlaying(false);
                        }}
                      >
                        <IonIcon size="small" icon={close}></IonIcon>
                      </IonButton>
                    </IonButtons>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          </div>
        ) : null}

        {/* <div>
          <IonItemSliding>
            <IonItemOptions side="start">
              <IonItemOption onClick={() => console.log('favorite clicked')}>Favorite</IonItemOption>
              <IonItemOption color="danger" onClick={() => console.log('share clicked')}>Share</IonItemOption>
            </IonItemOptions>

            <IonItem className="set">
              <IonLabel className="ion-text-center">START WORKOUT <span>Swipe</span> <IonIcon icon={swapHorizontal}></IonIcon> </IonLabel>
            </IonItem>

            <IonItemOptions side="end">
              <IonItemOption onClick={() => console.log('unread clicked')}>Unread</IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        </div> */}

        <div className="goalPad">
          <IonRow className="ion-text-center">
            <IonCol size="6">
              <IonCard color="light">
                <IonCardContent className="ion-text-center goal">
                  <IonLabel className="ion-text-center ion-text-uppercase">
                    YOUR GOAL
                  </IonLabel>
                  <p> {goal} Kg </p>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6">
              <IonCard color="light">
                <IonCardContent
                  className="ion-text-center goal"
                  onClick={() =>
                    myWeight.weight ? null : setShowGoalAlert(true)
                  }
                >
                  <IonLabel className="ion-text-center ion-text-uppercase">
                    CURRENT WEIGHT
                  </IonLabel>
                  {myWeight.weight ? (
                    <p> {myWeight.weight} Kg </p>
                  ) : (
                    <p>
                      <IonIcon icon={add}></IonIcon>
                    </p>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </div>

        <div className="note-root">
          <div className="note">
            {myWrkOut.map((item, index) => (
              <IonCard key={item.id} className="ion-margin-vertical">
                <IonItem className="ion-activated">
                  <IonLabel color="primary">
                    {capitalize(item.workout.name)}
                  </IonLabel>
                  <IonLabel
                    className="ion-text-uppercase"
                    slot="end"
                    color="medium"
                  >
                    {item.workout.bodyPart}
                  </IonLabel>
                  <IonButtons slot="end">
                    <IonButton id={item.id}>
                      <IonIcon color="medium" icon={ellipsisVertical}></IonIcon>
                    </IonButton>
                  </IonButtons>
                </IonItem>
                <IonCardContent className="ion-justify-content-center">
                  <IonRow>
                    {item.set.map((items, index) => (
                      <IonCol
                        key={index}
                        onClick={() => deleteSet(item, items, index)}
                      >
                        <div className="set">
                          <h4 style={{ fontWeight: "bold" }}>
                            SET {index + 1}
                          </h4>
                          <h6>
                            {items.weight} <span>Kg</span>
                          </h6>
                          <h6>
                            {items.rep} <span>Rep</span>
                          </h6>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>

                  <IonRow className="ion-float-right">
                    <IonCol onClick={() => addWrkOutData(item)}>
                      {/* <IonButtons>
                      <IonButton slot="start">
                        <IonIcon size="small" icon={add}></IonIcon>
                      </IonButton>
                    </IonButtons> */}
                      <IoAddSharp size={25} />
                    </IonCol>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
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
            <IonLabel className="ion-text-center" color="primary">Add Weight</IonLabel>
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
