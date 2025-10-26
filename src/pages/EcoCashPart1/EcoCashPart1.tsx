import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonText,
  IonImg,
  IonButton,
} from "@ionic/react";
import "./EcoCashPart1.css";

const EcoCashPart1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="pagarservicio-header">
          <div className="header-top">
            <IonImg
              src="/assets/user-icon.png"
              className="user-icon"
              alt="Usuario"
            />
            <div className="user-info">
              <IonText className="welcome-text">HOLA HANNIA</IonText>
              <IonText className="sub-text">
                Último ingreso: 14-10-2025 22:30:01 Vía Móvil
              </IonText>
            </div>
            <IonImg
              src="/assets/notif-icon.png"
              className="notif-icon"
              alt="Notificaciones"
            />
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ecocash-content" fullscreen>
        <div className="ecocash-container">
          {/* Encabezado Banorte */}
          <div className="ecocash-header">
            <IonImg
              src="/assets/Logo.png"
              alt="Banorte"
              className="banorte-logo"
            />
          </div>

          {/* Cuerpo principal */}
          <div className="ecocash-body">
            <IonText className="ecocash-greeting">Hola HANNIA</IonText>

            <IonText className="ecocash-message">
              Tenemos una gran noticia para ti
            </IonText>

            <IonText className="ecocash-description">
              ¡Has sido seleccionada para participar en nuestro nuevo programa{" "}
              <span className="bold">EcoCash</span>!
            </IonText>

            {/* Ícono del programa */}
            <div className="ecocash-icon-container">
              <IonImg
                src="/assets/eco-cash-green-icon.png"
                alt="EcoCash"
                className="ecocash-icon"
              />
            </div>

            <IonText className="ecocash-note">
              “Consume <span className="bold">menos</span>, gana más — así
              funciona <span className="eco-color">EcoCash</span>.”
            </IonText>

            {/* Botones */}
            <div className="ecocash-buttons">
              <IonButton expand="block" className="btn-principal">
                QUIERO SABER MÁS
              </IonButton>
              <IonButton fill="clear" className="btn-secundario">
                EN OTRO MOMENTO
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EcoCashPart1;
