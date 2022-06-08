import { IonContent, IonPage, IonCard, IonCardContent, IonCardHeader, IonRow, IonCol, IonInput, IonItem, IonLabel, IonButton, IonToast } from '@ionic/react'
import React, { useState } from 'react'
import Header from '../../components/Header/Header'

let bmi: any = 0;
const Calculator = () => {
    const [data, setData] = useState({
        weight: "",
        height: "",
    });
    const [showToast, setShowToast] = useState({
        show: false,
        msg: "",
        color: "",
    });
 

    const handleChange = (event: any) => {
        setData((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
       
        
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (!data.weight  && !data.height) {
         setShowToast({ show: true, msg: "Please enter weight and height", color: "danger" });
        }
        bmi = (parseInt(data.weight) || 0 / (parseInt(data.height) || 0 * parseInt(data.height) || 0)).toFixed(2);
     
       
        console.log(data);
        setData({ weight: "", height: "" })

    }
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

        <div className='ion-margin-vertical'>
            <IonCard>
                <IonCardHeader className='ion-text-center'>
                    <h1>{bmi > 0 ? bmi : `0.00` } BMI</h1>
                </IonCardHeader>
                <IonCardContent>
                    <IonRow>
                        <IonCol>
                            <IonItem>
                            <IonLabel position="floating">Weight (Kg)</IonLabel>
                            <IonInput name='weight' type='number' value={data.weight} onIonChange={(e) => handleChange(e)} required></IonInput>
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem>
                            <IonLabel position="floating">Height (cm)</IonLabel>
                            <IonInput name='height' type='number' value={data.height} onIonChange={(e) => handleChange(e)} required></IonInput>
                            </IonItem>
                        </IonCol>
                    </IonRow>
                    <IonRow  className='ion-margin-vertical ion-text-center'>
                    <IonCol>
                        <IonButton
                            type="submit"
                            onClick={(e) => handleSubmit(e)}
                            expand="block"
                            color="primary"
                        >  Calculate
                        </IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton
                            type="submit"
                            onClick={(e) => {setData({ weight: "", height: "" }); bmi = 0;}}
                            expand="block"
                            color="primary"
                            fill='outline'
                        >  Reset
                        </IonButton>
                    </IonCol>
                </IonRow>
                </IonCardContent>
            </IonCard>
        </div>
       
       
      </IonContent>
    </IonPage>
  )
}

export default Calculator