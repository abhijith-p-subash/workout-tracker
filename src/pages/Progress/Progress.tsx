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
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

import Loader from "../../components/Loader/Loader";
import { UserData } from "../../assets/data/seed";
import { Bar, Line, Radar, Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Chart as ChartJS } from "chart.js/auto";
import { calendarOutline } from "ionicons/icons";
import moment from "moment";
import { Filter, MyWorkOut, OrderBy, Res, Set } from "../../Models/Models";
import { auth } from "../../firebase/FireBase-config";
import { getWithQueryOrder } from "../../firebase/FireBase-services";

let myWrkOut: MyWorkOut[] = [];
let wrkOut: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    " August",
    "September",
    "October",
    "November",
    "December",
  ];

const Progress = () => {
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

  useIonViewWillEnter(() => {
    handleSubmit();
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
    myWrkOut = [];
    let filter: Filter[] = [
      {
        field: "uid",
        operator: "==",
        value: auth.currentUser?.uid || localStorage.getItem("uid"),
      },
    ];

    let orderBy: OrderBy = {
      field: "createdAt",
      direction: "desc",
      startAt: new Date(dateRange.$gte),
      endAt: new Date(dateRange.$lte),
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
     

      myWrkOut.forEach((doc: MyWorkOut, index: number) => {
        let kg: number = 0;
        let oldKg: number = 0;
        let m = new Date(doc.createdAt);
        doc.set.forEach((set: Set, index: number) => {
          kg += parseInt(set.weight);
        });
        oldKg = wrkOut[m.getMonth()];
        oldKg += kg;
        wrkOut[m.getMonth()] = oldKg;
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

        {/* <IonCard>
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
                        type="submit"
                        // onClick={(e) => handleSubmit(e)}
                        expand="block"
                        color="primary"
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
                        onClick={(e) =>
                          setDateRange({
                            $gte: moment().subtract(7, "d").format(),
                            $lte: moment().format(),
                          })
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
      </IonContent>
    </IonPage>
  );
};

export default Progress;
