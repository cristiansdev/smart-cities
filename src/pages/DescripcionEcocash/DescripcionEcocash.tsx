import React, { useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonImg,
  IonText,
  IonButton,
} from "@ionic/react";
import "./DescripcionEcocash.css";

const DescripcionEcocash: React.FC = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(".fade-in-section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    sections.forEach((section) => observer.observe(section));
  }, []);

  return (
    <IonPage>
      {/* HEADER */}
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

      {/* CONTENIDO */}
      <IonContent fullscreen className="ecocash-page">

        {/* SECCIÓN 1 */}
        <section className="fade-in-section section1">
          <IonText className="ecocash-title">EcoCash</IonText>

          <IonText className="ecocash-subtitle">
            Convierte tus <span className="bold">pagos de agua, luz y gas</span> 
            en <span className="bold">recompensas</span> por cuidar el planeta.
          </IonText>

          <IonText className="ecocash-desc">
            EcoCash automatiza tus pagos y premia tu 
            <span className="bold"> consumo responsable</span> 
            con cashback y rendimientos exclusivos.
          </IonText>

          <IonImg
            src="/assets/woman-img.png"
            alt="EcoCash"
            className="ecocash-girl"
          />

          <IonText className="ecocash-hint">
            ¿Cómo funciona?
          </IonText>
        </section>

        {/* SECCIÓN 2 */}
        <section className="fade-in-section section2">
          <div className="ecocash-step">
            <div className="icon-circle">1</div>
            <IonText className="step-text">
              Paga tus servicios directamente desde la app Banorte.
            </IonText>
          </div>

          <div className="ecocash-step">
            <div className="icon-circle">2</div>
            <IonText className="step-text">
              EcoCash analiza el promedio de consumo en tu zona.
            </IonText>
          </div>

          <div className="ecocash-step">
            <div className="icon-circle">3</div>
            <IonText className="step-text">
              Si tu consumo es menor al promedio, obtienes 
              <span className="bold"> 5% de cashback</span> sobre tu pago.
            </IonText>
          </div>

          <IonImg
            src="/assets/eco-cash-green-icon.png"
            alt="Cashback"
            className="cashback-icon"
          />

          <IonButton expand="block" className="btn-join">
            UNIRME A ECOCASH
          </IonButton>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default DescripcionEcocash;
