import React, { useState } from 'react';
import { IonToast } from '@ionic/react';


const Toast = ({open, msg}:any) => {
    const [showToast, setShowToast] = useState(false);
    console.log(open);
    return (
        <IonToast
            isOpen={open}
            // onDidDismiss={() => setShowToast(false)}
            message={msg}
            duration={2000}
        />
    )
}

export default Toast