import React from 'react';
import { IonLoading } from '@ionic/react';

const Loader = ({open, msg}:any) => {
  return (
    <IonLoading
        cssClass='my-custom-class'
        isOpen={open}
        // onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
        duration={5000}
      />
  )
}

export default Loader