import { IonBadge, IonIcon } from "@ionic/react";
import {
  notificationsOutline,
  logoUsd,
  cardOutline as cardAltIcon,
} from "ionicons/icons";
import "./HeroBanner.css";

type Props = {
  /** Ruta de la imagen (public/) */
  src?: string;
  /** Texto de la píldora roja */
  pillText?: string;
  /** Alto del banner (px). Ej: 240 */
  height?: number;
  /** Posición del recorte de la imagen (CSS object-position) */
  objectPosition?: string;
  /** Mostrar burbujas laterales o no */
  showBadges?: boolean;
};

export default function HeroBanner({
  src = "/assets/Imagen-Home-Screen.png",   // ← ABSOLUTO, no relativo
  pillText = "Conoce una nueva funcionalidad en Banorte",
  height = 240,
  objectPosition = "center top",
  showBadges = true,
}: Props) {
  return (
    <section
      className="bn-hero"
      style={
        {
          "--hero-height": `${height}px`,
          "--hero-object-position": objectPosition,
        } as React.CSSProperties
      }
    >
      <img className="bn-hero-img" src={src} alt="Banner" />

      {showBadges && (
        <div className="bn-hero-badges">
          <div className="bn-hero-bubble">
            <IonIcon icon={notificationsOutline} />
            <IonBadge color="danger" className="bn-hero-badge">
              1
            </IonBadge>
          </div>
          <div className="bn-hero-bubble">
            <IonIcon icon={logoUsd} />
          </div>
          <div className="bn-hero-bubble">
            <IonIcon icon={cardAltIcon} />
          </div>
        </div>
      )}

      {pillText && <div className="bn-hero-pill">{pillText}</div>}
    </section>
  );
}
