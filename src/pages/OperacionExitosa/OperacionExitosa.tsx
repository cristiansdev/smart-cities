import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonText,
  IonImg,
  IonCard,
  IonToggle,
  IonIcon,
  IonButton,
} from "@ionic/react";
import "./OperacionExitosa.css";
import { chevronBackOutline } from "ionicons/icons";


const OperacionExitosa: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pagarservicio-header">
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

            <IonContent className="operacionexitosa-content" fullscreen>
        <div className="success-container">
          {/* Parte verde superior */}
          <div className="success-header">
            <IonText className="success-title">Operación Exitosa</IonText>
            <IonText className="success-date">
              25 octubre 2025, 17:45
            </IonText>
            <IonText className="success-subtitle">
              Pago realizado correctamente
            </IonText>
            <IonImg
              src="/assets/recibo-icon.png"
              alt="Pago exitoso"
              className="success-icon"
            />
          </div>

          {/* Tarjeta blanca con datos */}
          <IonCard className="account-card">
            <div className="account-info">
              <img
                src="/assets/card-icon.png"
                alt="Tarjeta Banorte"
                className="card-image"
              />
              <div className="account-texts">
                <IonText className="account-name">Nómina</IonText>
                <IonText className="account-number">• 7789</IonText>
              </div>
            </div>
          </IonCard>

          {/* Botones */}
          <div className="buttons-container">
            <IonButton fill="outline" className="btn-descargar">
              Descargar
            </IonButton>
            <IonButton expand="block" className="btn-salir">
              Salir
            </IonButton>
          </div>
        </div>
      </IonContent>

    </IonPage>
  );
};

export default OperacionExitosa;
