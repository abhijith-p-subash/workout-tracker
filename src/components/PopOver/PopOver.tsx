import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react";


const PopOver = () => {
  return (
    <IonPopover trigger="p1" dismissOnSelect={true}>
      <IonContent>
        <IonList>
          <IonItem button={true} detail={false}>
            <IonLabel>Option 1</IonLabel>
          </IonItem>
          <IonItem button={true} detail={false}>
            <IonLabel>Option 2</IonLabel>
          </IonItem>
          <IonItem button={true} detail={true} id="nested-trigger">
            <IonLabel>Option 3</IonLabel>
          </IonItem>

          <IonPopover
            trigger="nested-trigger"
            dismissOnSelect={true}
            side="end"
          >
            <IonContent>
              <IonItem button={true}>
                <IonLabel>Nested Option</IonLabel>
              </IonItem>
            </IonContent>
          </IonPopover>
        </IonList>
      </IonContent>
    </IonPopover>
  );
};

export default PopOver;
