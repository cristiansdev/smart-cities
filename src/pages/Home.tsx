import {
  IonPage,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
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
} from "ionicons/icons";
import BanorteHeader from "../components/BanorteHeader";   // 🆕
import HeroBanner from "../components/HeroBanner";
import "./Home.css";

export default function Home() {
  return (
    <IonPage>
      {/* Header rojo desacoplado */}
      <BanorteHeader
        logoSrc="/assets/LogoBlanco.png"
        minHeight={70}
        logoHeight={52}
      />

      <IonContent fullscreen className="bn-content">
        {/* Hero con la imagen */}
        <HeroBanner
          src="/assets/Imagen-Home-Screen.png"
          height={240}
          objectPosition="center top"
          pillText="Conoce una nueva funcionalidad en Banorte"
          showBadges={true}
        />
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
              <IonCard className="bn-action-card bn-orange" button>
                <IonCardContent>
                  <IonIcon icon={personCircleOutline} />
                  <span>Cuenta</span>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard className="bn-action-card bn-yellow" button>
                <IonCardContent>
                  <IonIcon icon={repeatOutline} />
                  <span>Transferencias</span>
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4">
              <IonCard
                className="bn-action-card bn-green"
                routerLink="/scan"
                button
              >
                <IonCardContent>
                  <IonIcon icon={receiptOutline} />
                  <span>Pago Servicios</span>
                </IonCardContent>
              </IonCard>
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
