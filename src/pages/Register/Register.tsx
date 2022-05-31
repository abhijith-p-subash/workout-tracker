import React, { useState } from "react";
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
} from "@ionic/react";
import { useHistory } from "react-router";

import Header from "../../components/Header/Header";
import Loader from "../../components/Loader/Loader";
import { auth } from "../../firebase/FireBase-config";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {createDoc} from "../../firebase/FireBase-services";
import { User } from "../../Models/Models"; 

import "./Register.css";let userData: User = {}

const Register = () => {
  const [regData, setRegData] = useState({
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  // const [userData, setUserData] = useState({
  //   uid:"",
  //   name:"",
  //   email:"",
  // })
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" });
  const history = useHistory();

  const handleChange = (event: any) => {
    console.log("changed");

    setRegData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(regData);
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      setShowLoader({ show: true, msg: "Registering..." });
    
      
      if (
        regData.password !== regData.confirmPassword ||
        regData.password === "" ||
        regData.confirmPassword === "" ||
        regData.email === "" ||
        regData.password.length < 6 ||
        regData.confirmPassword.length < 6 ||
        regData.name === ""
      ) {
        let Msg = [];
        (regData.password !== regData.confirmPassword) && Msg.push("Passwords do not match");
        (regData.password === "") && Msg.push("Password is required");
        (regData.email === "") && Msg.push("Email is required");
        (regData.password.length < 6) && Msg.push("Password must be at least 6 characters");
        (regData.name === "") && Msg.push("Name is required");
        setShowToast({
          show: true,
          msg: `${Msg}`,
          color: "danger",
        });
        setShowLoader({ show: false, msg: "" });
        return;
      }

      console.log("Clicke");
      let reg = await createUserWithEmailAndPassword(
        auth,
        regData.email,
        regData.password
      );

      console.log(reg.user);
      if (reg.user) {
        await sendEmailVerification(reg.user);
        // localStorage.setItem("uid", reg?.user.uid);
        // localStorage.setItem("accessToken", reg?.user.refreshToken);
        // localStorage.setItem("auth", "true");
        userData ={
          uid: reg.user.uid,
          name: regData.name,
          email: regData.email,
        };

        console.log(userData);
        const  regUser = createDoc("users", userData);
        alert("Registration Successful");
        console.log(regUser);
        
        
        setShowToast({
          show: true,
          msg: "Registered successfully",
          color: "success",
        });
        setShowLoader({ show: false, msg: "" });
        history.push("/login");
      }

      setRegData({name:"", email: "", password: "", confirmPassword: "" });
    } catch (error) {
      const err = JSON.parse(JSON.stringify(error))
      setShowToast({ show: true, msg: `${err.code}`, color: "danger" });
      setShowLoader({ show: false, msg: "" });
    }
  };
  return (
    <IonPage id='main'>
      <Header title="Register" />
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
            <h1>Vrk-Out</h1>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol sizeMd="6" offsetMd="3">
            <IonList>
            <IonItem>
                <IonLabel position="floating">Name</IonLabel>
                <IonInput
                  value={regData.name}
                  onIonChange={(e) => handleChange(e)}
                  type="text"
                  name="name"
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  value={regData.email}
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
                  value={regData.password}
                  onIonChange={(e) => handleChange(e)}
                  type="password"
                  name="password"
                  required
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="floating">Confirm Password</IonLabel>
                <IonInput
                  minlength={6}
                  value={regData.confirmPassword}
                  onIonChange={(e) => handleChange(e)}
                  type="password"
                  name="confirmPassword"
                  required
                ></IonInput>
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol sizeMd="6" offsetMd="3">
            <IonButton
              onClick={() => {
                console.log("clicef");
                history.push("/login");
              }}
              className="ion-margin-vertical"
              type="button"
              fill="clear"
              expand="full"
              color="primary"
            >
              Already have an Account ?
            </IonButton>
            <IonButton
              type="submit"
              onClick={(e) => handleSubmit(e)}
              expand="block"
              color="primary"
            >
              Register
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Register;
