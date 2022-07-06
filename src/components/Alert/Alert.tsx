import { IonAlert } from '@ionic/react'


const Alert = (props:any) => {
  return (
    <IonAlert
    isOpen={props.open}
    cssClass='my-custom-class'
    header={'Alert'}
    subHeader={'Subtitle'}
    message={'This is an alert message.'}
    buttons={['OK']}
  />
  )
}

export default Alert