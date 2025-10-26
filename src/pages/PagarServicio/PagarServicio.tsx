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
} from "@ionic/react";
import "./PagarServicio.css";
import { chevronBackOutline } from "ionicons/icons";


const PagarServicio: React.FC = () => {
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

      <IonContent className="pagarservicio-content" fullscreen>
      <div className="pagarservicio-container">
        <div className="payment-info">
          <IonText className="payment-title">
            <IonIcon icon={chevronBackOutline} className="back-icon" />
            Pagar Servicio
          </IonText>
          <IonText className="payment-label">Monto a pagar</IonText>
          <IonText className="payment-amount">$300.00 MXN</IonText>
          <IonText className="payment-note">
            Esta cantidad debe coincidir con tu recibo y no puedes cambiarla.
          </IonText>
        </div>

        <IonCard className="service-card-first">
          <div className="service-header">
            <img src="/assets/cfe-logo.png" alt="CFE" className="cfe-logo" />
            <div>
              <IonText className="service-name">CFE</IonText>
              <IonText className="service-ref">Referencia: 4140930400184</IonText>
            </div>
          </div>
        </IonCard>

        <IonCard className="service-card">
          <div className="save-service">
            <IonText className="save-label">Guardar Servicio</IonText>
            <IonToggle className="toggle-rojo" checked={false} />
          </div>
          <IonText className="save-note">
            Guárdalo y haz más rápido tus próximos pagos.
          </IonText>
        </IonCard>
      </div>
    </IonContent>

    </IonPage>
  );
};

export default PagarServicio;
