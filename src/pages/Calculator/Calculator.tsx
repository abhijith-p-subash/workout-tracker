import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonRow,
  IonCol,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonToast,
  IonTitle,
} from "@ionic/react";
import React, { useState } from "react";
import Header from "../../components/Header/Header";

let bmi: any = 0;
const Calculator = () => {
  const [data, setData] = useState({
    weight: 0,
    height: 0,
  });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });

  const [msg, setmsg] = useState({
    msg: "",
    color: "",
  });

  const handleChange = (event: any) => {
    setData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!data.weight && !data.height) {
      setShowToast({
        show: true,
        msg: "Please enter weight and height",
        color: "danger",
      });
    }
    bmi = (data.weight / ((data.height * data.height) / 10000)).toFixed(2);

    if (bmi < 18.5) {
      setmsg({ msg: "You are underweight", color: "danger" });
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setmsg({ msg: "You are normal", color: "success" });
    } else {
      setmsg({ msg: "You are overweight", color: "danger" });
    }
    setData({ weight: 0, height: 0 });
  };
  return (
    <IonPage>
      <IonContent>
        <Header title={"BMI Calculator"} />

        <IonToast
          isOpen={showToast.show}
          onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
          message={showToast.msg}
          duration={1000}
          color={showToast.color}
        />

        <div className="ion-margin-vertical">
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <h1>{bmi > 0 ? bmi : `0.00`} BMI</h1>
              <IonTitle color={bmi ? msg.color : "medium"}>
                {bmi ? msg.msg : null}
              </IonTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonRow>
                <IonCol>
                  <IonItem>
                    <IonLabel position="floating">Weight (Kg)</IonLabel>
                    <IonInput
                      name="weight"
                      type="number"
                      value={data.weight}
                      onIonChange={(e) => handleChange(e)}
                      required
                    ></IonInput>
                  </IonItem>
                </IonCol>
                <IonCol>
                  <IonItem>
                    <IonLabel position="floating">Height (cm)</IonLabel>
                    <IonInput
                      name="height"
                      type="number"
                      value={data.height}
                      onIonChange={(e) => handleChange(e)}
                      required
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>
              <IonRow className="ion-margin-vertical ion-text-center">
                <IonCol>
                  <IonButton
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                    expand="block"
                    color="primary"
                  >
                    {" "}
                    Calculate
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    type="submit"
                    onClick={(e) => {
                      setData({ weight: 0, height: 0 });
                      bmi = 0;
                    }}
                    expand="block"
                    color="primary"
                    fill="outline"
                  >
                    {" "}
                    Reset
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Calculator;
