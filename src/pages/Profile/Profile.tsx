import { IonCol, IonContent, IonPage, IonRow, IonTitle, IonToast, IonAvatar, IonItem, IonLabel, IonCard, IonButton, IonIcon, IonCardContent, IonText, IonSegment, IonSegmentButton, IonButtons, } from '@ionic/react'
import React, { useState } from 'react';


import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';

import "./Profile.css";
import { accessibility, barbell, calendarNumber, call, cameraOutline, locationOutline, mail, pencil } from 'ionicons/icons';

const Profile = () => {
  const [showLoader, setShowLoader] = useState({ show: false, msg: "" || {} });
  const [showToast, setShowToast] = useState({
    show: false,
    msg: "",
    color: "",
  });
  return (
    <IonPage>
      <IonContent>
        <Header title={"Profile"} />
        <Loader open={showLoader.show} msg={showLoader.msg} />
        <IonToast
          isOpen={showToast.show}
          onDidDismiss={() => setShowToast({ show: false, msg: "", color: "" })}
          message={showToast.msg}
          duration={1000}
          color={showToast.color}
        />
        <div className='ion-margin profileCard'>
          <IonCard color='light' >
            <div className='img-wrapper'>
              <img src="https://media-exp1.licdn.com/dms/image/C5603AQH5aKilFMvP-Q/profile-displayphoto-shrink_800_800/0/1643982067844?e=1660176000&v=beta&t=lmyABd8vEetuJsvVCRbVoUrdgMUBHBCMDmYZoQGrOzc" alt="" />
              {/* <img src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png' /> */}
              <IonButton color='light'>
                <IonIcon icon={cameraOutline} color="medium"></IonIcon>
              </IonButton>
            </div>
            <IonCardContent className='ion-text-center'>
              <h2>Abhijith P Subash</h2>
              <IonText color='medium'>
                <div className='ion-justify-content-center' style={{ display: 'flex' }}>
                  <IonIcon icon={locationOutline} color="medium"></IonIcon>
                  <p>2345 Street, Ohio, USA.</p>
                </div>
              </IonText>
            </IonCardContent>
          </IonCard>
          {/* 
          <IonSegment onIonChange={e => console.log('Segment selected', e.detail.value)}>
          <IonSegmentButton value="friends">
            <IonLabel>Personal</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="enemies">
            <IonLabel>Personal</IonLabel>
          </IonSegmentButton>
        </IonSegment> */}

          <IonCard  >
            <IonCardContent className='ion-text-center'>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={mail} color="primary"></IonIcon>
                <IonLabel>abhijith.p.subash@gmail.com</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={call} color="primary"></IonIcon>
                <IonLabel>9400895025</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={calendarNumber} color="primary"></IonIcon>
                <IonLabel>02/03/1997</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={accessibility} color="primary"></IonIcon>
                <IonLabel>162 cm</IonLabel>
              </IonItem>
              <IonItem >
                <IonIcon className='ion-margin-horizontal' icon={barbell} color="primary"></IonIcon>
                <IonLabel>70 Kg</IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
          <IonRow className='ion-text-center'>
            <IonCol>
                <IonButton fill='outline'>UPDATE</IonButton>
            </IonCol>
          </IonRow>

        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile