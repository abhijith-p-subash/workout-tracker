import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToast,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import  { useState } from "react";
import Loader from "../../components/Loader/Loader";
import { getById, update } from "../../firebase/FireBase-services";
import { Res, User } from "../../Models/Models";
import moment from "moment";

// let user: User = {} as User;

const EditProfile = () => {
  const [user, setUser] = useState({} as User);
  const [calenderCtrl, setCalenderCtrl] = useState(false);
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });

  const history = useHistory();

  const ID: { id: string } = useParams();

  useIonViewWillEnter(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setUser({});
    setShowLoader({ show: true, msg: "Loading..." });
    const res: Res = await getById("users", ID.id);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      setUser({ ...res.data });
      setShowLoader({ show: false, msg: "" });
    }
  };

  const handleChange = (event: any) => {
    setUser((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setShowLoader({ show: true, msg: "Updating..." });
    const res: Res = await update("users", ID.id, user);
    if (res.error) {
      const err = JSON.parse(JSON.stringify(res.data));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    } else {
      history.push("/profile");
      setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage>
      <IonContent>
        {/* <Header title={"Profile"} /> */}
        <IonHeader>
          <IonToolbar color="primary">
            <IonTitle>Edit Profile</IonTitle>
            <IonButtons slot="start">
              <IonMenuButton menu="m1"></IonMenuButton>
            </IonButtons>
            <IonButtons slot="end">
              <IonButton onClick={() => history.push("/profile")}>
                {/* <IonIcon icon={close}></IonIcon> */}
                close
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

        {/* ****************CALENDER POPOVER **************************/}
        <IonPopover
          size="auto"
          side="left"
          alignment="center"
          trigger="open-date-input"
          showBackdrop={true}
        >
          <IonDatetime
            presentation="date"
            name="dob"
            onIonChange={(e) => handleChange(e)}
            value={
              user.dob || false ? moment(user.dob).format() : moment().format()
            }
          />
        </IonPopover>
        {/* ****************CALENDER POPOVER **************************/}

        <div className="ion-margin-vertical ion-padding">
          <IonItem>
            <IonLabel position="floating">Name</IonLabel>
            <IonInput
              type="text"
              name="name"
              value={user.name}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              disabled
              type="email"
              name="email"
              value={user.email}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Phone</IonLabel>
            <IonInput
              type="text"
              name="phone"
              value={user.phone}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Gender</IonLabel>
            <IonSelect
              value={user.gender}
              name="gender"
              placeholder="Select One"
              onIonChange={(e) => handleChange(e)}
            >
              <IonSelectOption value="female">Female</IonSelectOption>
              <IonSelectOption value="male">Male</IonSelectOption>
              <IonSelectOption value="others">Others</IonSelectOption>
            </IonSelect>
          </IonItem>
          {/* <IonItem>
                        <IonLabel position="floating">Date of Birth</IonLabel>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setCalenderCtrl(false)} id="open-date-input">
                                <IonIcon icon={calendarOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                        <IonInput type='text' name='dob' value={moment(user.dob).format("L")} onIonChange={(e) => handleChange(e)}></IonInput>
                    </IonItem> */}
          <IonItem>
            <IonLabel position="floating">Age</IonLabel>
            <IonInput
              type="number"
              name="age"
              value={user.age}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Blood Group</IonLabel>
            <IonInput
              type="text"
              name="blood"
              value={user.blood}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Height (cm)</IonLabel>
            <IonInput
              type="number"
              name="height"
              value={user.height}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Weight (Kg)</IonLabel>
            <IonInput
              type="number"
              name="weight"
              value={user.weight}
              onIonChange={(e) => handleChange(e)}
            ></IonInput>
          </IonItem>
        </div>
        <IonRow className="ion-text-center">
          <IonCol>
            <IonButton
              type="submit"
              onClick={(e) => handleSubmit(e)}
              expand="block"
              color="primary"
            >
              {" "}
              UPDATE
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;

function e(e: any): void {
  throw new Error("Function not implemented.");
}
