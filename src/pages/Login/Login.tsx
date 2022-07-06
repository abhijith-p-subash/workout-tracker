import { useState } from "react";
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
  IonToast,
} from "@ionic/react";

import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import { auth } from "../../firebase/FireBase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

import "./Login.css";
import { useHistory } from "react-router";

const Login = () => {
  const [loginData, setLogindata] = useState({ email: "", password: "" });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const history = useHistory();

  const handleChange = (event: any) => {
    setLogindata((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: any) => {
    try {
      event.preventDefault();
      setShowLoader({ show: true, msg: "Logging in..." });
      let logIn = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );
      localStorage.setItem("uid", logIn.user.uid);
      localStorage.setItem("accessToken", logIn.user.refreshToken);
      localStorage.setItem("auth", "true");

      if (logIn.user) {
        setShowToast({
          show: true,
          msg: "Logged in successfully",
          color: "success",
        });
        setShowLoader({ show: false, msg: "" });
        history.push("/home");
      }

      setLogindata({ email: "", password: "" });
      // await SplashScreen.show({
      //     showDuration: 2000,
      //     autoHide: true
      //   });
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error));
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    }
  };

  return (
    <IonPage id="main">
      <Header title="Login" />
      <IonContent fullscreen className="ion-padding ion-margin">
        {/* <Toast open={showToast.show} msg={showToast.msg} /> */}
        <IonToast
          isOpen={showToast.show}
          onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
          message={showToast.msg}
          duration={1000}
          color={showToast.color}
        />
        <Loader open={showLoader.show} msg={showLoader.msg} />
        <IonRow>
          <IonCol size="12" className="ion-text-center">
            <h1>
              <span className="heading">AJ-Squad</span>
            </h1>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol sizeMd="6" offsetMd="3">
            <IonList>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  value={loginData.email}
                  onIonChange={(e) => handleChange(e)}
                  type="email"
                  name="email"
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  minlength={6}
                  value={loginData.password}
                  onIonChange={(e) => handleChange(e)}
                  type="password"
                  name="password"
                  required
                ></IonInput>
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol sizeMd="6" offsetMd="3">
            <div className="ion-text-center ion-margin-top ">
              <a onClick={() => history.push("/resetpassword")}>
                Forgot Password ?
              </a>
            </div>
            <IonButton
              onClick={() => history.push("/register")}
              className="ion-margin-vertical"
              type="button"
              fill="clear"
              expand="full"
              color="primary"
            >
              Create new Account
            </IonButton>
            <IonButton
              type="submit"
              onClick={(e) => handleSubmit(e)}
              expand="block"
              color="primary"
            >
              Login
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Login;
