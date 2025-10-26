import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonText,
  IonButton,
  IonImg,
} from "@ionic/react";
import "./Scanner.css";

const Scanner: React.FC = () => {
  return (
    <IonPage>
      {/* Encabezado Banorte */}
      <IonHeader>
        <IonToolbar className="scanner-header">
          <div className="header-top">
            <IonImg src="/assets/user-icon.png" className="user-icon" alt="Usuario" />
            <div className="user-info">
              <IonText className="welcome-text">HOLA HANNIA</IonText>
              <IonText className="sub-text">
                Último ingreso: 14-10-2025 22:30:01 Vía Móvil
              </IonText>
            </div>
            <IonImg src="/assets/notif-icon.png" className="notif-icon" alt="Notificaciones" />
          </div>
        </IonToolbar>
      </IonHeader>

      {/* Contenido principal */}
      <IonContent className="scanner-content" fullscreen>
        <div className="custom-buttons">
          <IonButton className="button-white">
            <IonImg src="/assets/transferencia-icon.png" alt="Icono 1" className="btn-img" />
          </IonButton>

          <IonButton className="button-white">
            <IonImg src="/assets/retirar-dinero-icon.png" alt="Icono 2" className="btn-img" />
          </IonButton>

          <IonButton className="button-gray">
            <IonImg src="/assets/pagos-servicios-icon.png" alt="Icono 3" className="btn-img" />
          </IonButton>

          <IonButton className="button-white">
            <IonImg src="/assets/token-icon.png" alt="Icono 4" className="btn-img" />
          </IonButton>
        </div>

        <div className="scanner-main">
          <IonText className="scanner-title">
            <h2>Escanea tu código QR</h2>
          </IonText>

          <div className="qr-frame">
            <IonImg
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Ejemplo"
              alt="QR"
              className="qr-img"
            />
          </div>

          <IonButton expand="block" className="next-button">
            Continuar
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Scanner;