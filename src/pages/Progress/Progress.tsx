import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore";
import Loader from "../../components/Loader/Loader";
import { UserData } from "../../assets/data/seed";
import { Bar, Line, Radar, Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import { calendarOutline } from "ionicons/icons";
import moment from "moment";
import {
  Filter,
  MyWeight,
  MyWorkOut,
  OrderBy,
  Res,
  Set,
} from "../../Models/Models";
import { auth } from "../../firebase/FireBase-config";
import {
  getWithQuery,
  getWithQueryOrder,
} from "../../firebase/FireBase-services";
import { bodyPart } from "../../Seeder/BodyPart";
import { capitalize } from "../../Util/Util";

let myWrkOut: MyWeight[] = [],
  myWrkOut1: MyWorkOut[] = [],
  wrkOut: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  wrkOut1: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  goal = 0;

const Progress = () => {
  const [segment, setSegment] = useState("lift" || undefined);
  const [bPart, setBPart] = useState("back");
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [dateRange, setDateRange] = useState({
    $gte: moment().subtract(30, "d").format(),
    $lte: moment().format(),
  });
  const [calenderCtrl, setCalenderCtrl] = useState(false);
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  Chart.register(...registerables);
  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "weight",
        backgroundColor: "rgba(75, 214, 224, 0.699)",
        borderColor: "rgba(75, 214, 224, 0.699)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(12, 125, 133, 0.699)",
        hoverBorderColor: "rgba(12, 125, 133, 0.699)",
        data: wrkOut,
      },
    ],
  };

  const barChartData1 = {
    labels: labels,
    datasets: [
      {
        label: "weight",
        backgroundColor: "rgba(255, 36, 36, 0.699)",
        borderColor: "rgba(255, 36, 36, 0.699)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255, 36, 127, 0.699)",
        hoverBorderColor: "rgba(255, 36, 127, 0.699)",
        data: wrkOut1,
      },
    ],
  };

  useIonViewWillEnter(() => {
    handleSubmit();
    handleWeightLift({}, "back");
  }, []);

  const handleChange = (event: any) => {
    setDateRange((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async () => {
    // event.preventDefault();
    setShowLoader({ show: true, msg: "Loading..." });
    const UID = await localStorage.getItem("uid");
    let kg: number = 0,
      avg = 0;
    myWrkOut = [];
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
    ];

    // let orderBy: OrderBy = {
    //   field: "createdAt",
    //   direction: "desc ",
    //   startAt: Timestamp.fromDate(new Date(dateRange.$gte)),
    //   endAt: Timestamp.fromDate(new Date(dateRange.$lte)),
    // };

    let orderBy: OrderBy = {
      field: "createdAt",
      direction: "desc ",
      startAt: Timestamp.fromDate(
        new Date(moment().startOf("year").format("MM/DD/YYYY"))
      ),
      endAt: Timestamp.fromDate(
        new Date(moment().endOf("year").format("MM/DD/YYYY"))
      ),
    };

    setShowLoader({ show: true, msg: "Loading..." });

    const user: Res = await getWithQuery("users", filter);
    const res: Res = await getWithQueryOrder("myWeight", filter, orderBy);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: MyWeight, index: number) => {
        myWrkOut.push(doc);
      });
      goal = parseInt(user.data[0].height) - 100;

      labels.forEach((month, index) => {
        let filterArr = myWrkOut.filter((wrk) => {
          let m = moment(new Date(wrk.createdAt.toDate()));
          console.log(m.month());

          return m.month() - 1 === index;
        });

        filterArr.forEach((doc, index: number) => {
          kg = kg + parseInt(doc.weight);
        });
        avg = kg / filterArr.length;
        wrkOut[index] = avg;
      });

      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  const handleWeightLift = async (e: any, param: string) => {
    wrkOut1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    setShowLoader({ show: true, msg: "Loading..." });
    setBPart(param === "" ? e.target.value : param);
    console.log(bPart);

    myWrkOut1 = [];
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
    ];

    let orderBy: OrderBy = {
      field: "createdAt",
      direction: "desc ",
      startAt: Timestamp.fromDate(
        new Date(moment().startOf("year").format("MM/DD/YYYY"))
      ),
      endAt: Timestamp.fromDate(
        new Date(moment().endOf("year").format("MM/DD/YYYY"))
      ),
    };

    setShowLoader({ show: true, msg: "Loading..." });
    const res: Res = await getWithQueryOrder("myWorkOut", filter, orderBy);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      res.data.forEach((doc: MyWorkOut, index: number) => {
        myWrkOut1.push(doc);
      });

      let filterArr = myWrkOut1.filter((wrk) => {
        return wrk.workout.bodyPart === (param === "" ? e.target.value : param);
      });

      filterArr.forEach((doc: MyWorkOut, index: number) => {
        let kg: number = 0;
        let oldKg: number = 0;
        let m = moment(new Date(doc.createdAt.toDate()));

        doc.set.forEach((set: Set, index: number) => {
          kg += parseInt(set.weight);
        });

        oldKg = wrkOut1[m.month()];
        oldKg += kg;
        wrkOut1[m.month()] = oldKg;
      });

      setShowToast({ show: true, msg: "Workout Added", color: "success" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Progress</IonTitle>
          <IonButtons slot="start">
            <IonMenuButton menu="m1"></IonMenuButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Loader open={showLoader.show} msg={showLoader.msg} />
        {/* <Chart chartData={userData} /> */}

        {/* ****************FROM CALENDER POPOVER **************************/}
        <IonPopover
          size="auto"
          side="left"
          alignment="center"
          trigger="fromDate"
          showBackdrop={true}
        >
          <IonDatetime
            presentation="date"
            onIonChange={(e) => handleChange(e)}
            value={moment(dateRange.$gte).format() || moment().format()}
            max={moment(dateRange.$lte).format()}
            name="$gte"
          />
        </IonPopover>
        {/* ****************FROM CALENDER POPOVER **************************/}

        {/* ****************TO CALENDER POPOVER **************************/}
        <IonPopover
          size="auto"
          side="left"
          alignment="center"
          trigger="toDate"
          showBackdrop={true}
        >
          <IonDatetime
            presentation="date"
            onIonChange={(e) => handleChange(e)}
            value={moment(dateRange.$lte).format() || moment().format()}
            min={moment(dateRange.$gte).format()}
            name="$lte"
          />
        </IonPopover>
        {/* ****************TO CALENDER POPOVER **************************/}
        {/* 
        <IonCard>
          <IonCardContent>
            <IonAccordionGroup>
              <IonAccordion value="colors">
                <IonItem slot="header">
                  <IonLabel color="medium">
                    {" "}
                    {moment(dateRange.$gte).format("L")} to{" "}
                    {moment(dateRange.$lte).format("L")}
                  </IonLabel>
                </IonItem>
                <IonList slot="content">
                  <IonItem>
                    <IonLabel>From: </IonLabel>
                    <IonButtons slot="end">
                      <IonButton
                        onClick={() => setCalenderCtrl(false)}
                        id="fromDate"
                      >
                        <IonIcon
                          color="medium"
                          icon={calendarOutline}
                        ></IonIcon>
                      </IonButton>
                    </IonButtons>
                    <IonInput
                      color="medium"
                      type="text"
                      name="$gte"
                      value={moment(dateRange.$gte).format("L")}
                      onIonChange={(e) => handleChange(e)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel className="ion-margin-end">To: </IonLabel>
                    <IonButtons slot="end">
                      <IonButton
                        onClick={() => setCalenderCtrl(false)}
                        id="toDate"
                      >
                        <IonIcon
                          color="medium"
                          icon={calendarOutline}
                        ></IonIcon>
                      </IonButton>
                    </IonButtons>
                    <IonInput
                      color="medium"
                      type="text"
                      name="$lte"
                      value={moment(dateRange.$lte).format("L")}
                      onIonChange={(e) => handleChange(e)}
                    ></IonInput>
                  </IonItem>
                  <IonRow className="ion-margin-top">
                    <IonCol>
                      <IonButton
                        size="small"
                        // type="submit"
                        // onClick={(e) => handleSubmit(e)}
                        expand="block"
                        color="primary"
                        onClick={()=>handleSubmit()}
                      >
                        {" "}
                        Apply
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        size="small"
                        expand="block"
                        color="primary"
                        fill="outline"
                        onClick={() =>{
                          setDateRange({
                            $gte: moment().subtract(7, "d").format(),
                            $lte: moment().format(),
                          }); handleSubmit()}
                        }
                      >
                        {" "}
                        Reset
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCardContent>
        </IonCard> */}
    <div style={{marginTop:20}}>
    <IonSegment
          value={segment}
          select-on-focus
          swipeGesture
          onIonChange={(e) => {
            setSegment(`${e.detail.value}`);
          }}
        >
          <IonSegmentButton value="lift">
            <IonLabel>WEIGHT LIFT</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="lose">
            <IonLabel>WEIGHT LOSE</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {segment === "lift" && (
          <div className="ion-margin-vertical ion-content">
            <IonItem className="ion-margin">
              <IonSelect
                interface="action-sheet"
                placeholder="Back"
                // value={bPart}
                onIonChange={(e) => {
                  handleWeightLift(e, "");
                }}
              >
                {bodyPart.map((item: string, index: number) => (
                  <IonSelectOption key={index} value={item}>
                    {capitalize(item)}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            <IonCard className="ion-margin-vertical">
              <IonCardContent>
                <IonItem>
                  <IonLabel>tres</IonLabel>
                  <Line
                    height={250}
                    data={barChartData1}
                    options={{ maintainAspectRatio: true }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonCard className="ion-margin-vertical">
              <IonCardContent>
                <IonItem>
                  <IonLabel>tres</IonLabel>
                  <Radar
                    data={barChartData1}
                    options={{ maintainAspectRatio: true }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {segment === "lose" && (
          <div className="ion-margin-vertical" color="medium">
            <IonCard color="light">
              <IonCardContent className="ion-text-center goal">
                <IonLabel className="ion-text-center ion-text-uppercase">
                  YOUR GOAL
                </IonLabel>
                <p> {goal} Kg </p>
              </IonCardContent>
            </IonCard>
            <IonCard className="ion-margin-vertical">
              <IonCardContent>
                <IonItem>
                  <IonLabel>tres</IonLabel>
                  <Line
                    height={250}
                    data={barChartData}
                    options={{ maintainAspectRatio: true }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>

            <IonCard className="ion-margin-vertical">
              <IonCardContent>
                <IonItem>
                  <IonLabel>tres</IonLabel>
                  <Radar
                    data={barChartData}
                    options={{ maintainAspectRatio: true }}
                  />
                </IonItem>
              </IonCardContent>
            </IonCard>
          </div>
        )}
    </div>
      </IonContent>
    </IonPage>
  );
};

export default Progress;
