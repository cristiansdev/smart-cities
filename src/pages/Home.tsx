import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonButton,
} from "@ionic/react";
import {
  personCircleOutline,
  repeatOutline,
  receiptOutline,
  cashOutline,
  cardOutline,
  keyOutline,
  alertCircleOutline,
  leafOutline,
} from "ionicons/icons";
import BanorteHeader from "../components/BanorteHeader";
import HeroBanner from "../components/HeroBanner";
import "./Home.css";
import { useIonRouter } from "@ionic/react";

export default function Home() {
  const router = useIonRouter();

  return (
    <IonPage>
      {/* Header rojo desacoplado */}
      <BanorteHeader
        logoSrc="/assets/LogoBlanco.png"
        minHeight={70}
        logoHeight={52}
      />

      <IonContent fullscreen className="bn-content">
        {/* Hero con imagen */}
        <div className="bn-hero-wrapper">
          <HeroBanner
            src="/assets/Imagen-Home-Screen.png"
            height={240}
            objectPosition="center top"
            pillText="Conoce una nueva funcionalidad en Banorte"
            showBadges={true}
          />

          {/* Botón verde flotante */}
          <button
            className="bn-floating-btn"
            onClick={() => router.push("/eco-cash-part-1", "forward")}
          >
            <IonIcon icon={leafOutline} />
          </button>
        </div>

        {/* Tarjeta de saludo */}
        <div className="bn-greeting bn-card-g">
          <IonText color="dark">
            <h2>Hola, Hannia</h2>
            <p>¿Qué vamos a hacer?</p>
          </IonText>
        </div>

        {/* Acciones principales */}
        <IonGrid className="bn-actions">
          <IonRow>
            <IonCol size="4">
              <div role="button" className="bn-quick bn-orange">
                <div className="bn-quick-ring" />
                <IonIcon icon={personCircleOutline} />
                <span>Cuenta</span>
              </div>
            </IonCol>

            <IonCol size="4">
              <div role="button" className="bn-quick bn-yellow">
                <div className="bn-quick-ring" />
                <IonIcon icon={repeatOutline} />
                <span>Transferencias</span>
              </div>
            </IonCol>

            <IonCol size="4">
              <div
                role="button"
                className="bn-quick bn-green"
                onClick={() => router.push("/payments", "forward")}
              >
                <div className="bn-quick-ring" />
                <IonIcon icon={receiptOutline} />
                <span>Pago Servicios</span>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* Menú */}
        <div className="bn-menu-wrap">
          <div className="bn-menu-header">Menú</div>

          <div className="bn-menu">
            <div className="bn-menu-item">
              <div className="bn-menu-ico">
                <IonIcon icon={cashOutline} />
              </div>
              <span>Retirar dinero</span>
            </div>
            <div className="bn-menu-item">
              <div className="bn-menu-ico muted">
                <IonIcon icon={cardOutline} />
              </div>
              <span>Tarjeta Digital</span>
            </div>
            <div className="bn-menu-item">
              <div className="bn-menu-ico">
                <IonIcon icon={keyOutline} />
              </div>
              <span>Token Celular</span>
            </div>
            <div className="bn-menu-item">
              <div className="bn-menu-ico">
                <IonIcon icon={alertCircleOutline} />
              </div>
              <span>Asistencia</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
