import { useState } from "react";
import { IonToast } from "@ionic/react";

const Toast = ({ open, msg }: any) => {
  const [showToast, setShowToast] = useState(false);
  return (
    <IonToast
      isOpen={open}
      // onDidDismiss={() => setShowToast(false)}
      message={msg}
      duration={2000}
    />
  );
};

export default Toast;
