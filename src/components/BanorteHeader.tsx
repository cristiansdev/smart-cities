import { IonHeader, IonToolbar } from "@ionic/react";
import React from "react";
import "./BanorteHeader.css";

type Props = {
  /** Ruta del logo en blanco (en public/assets) */
  logoSrc?: string;
  /** Alto del recuadro rojo (en px) */
  minHeight?: number;
  /** Alto del logo (en px) */
  logoHeight?: number;
};

export default function BanorteHeader({
  logoSrc = "/assets/LogoBlanco.png",
  minHeight = 88,
  logoHeight = 52,
}: Props) {
  return (
    <IonHeader className="bn-header">
      <IonToolbar
        color="primary"
        className="bn-toolbar"
        style={
          {
            /* Sobrescribe la variable interna de Ionic */
            ["--min-height" as any]: `${minHeight}px`,
          } as React.CSSProperties
        }
      >
        <div className="bn-brand">
          <img
            src={logoSrc}
            alt="Banorte"
            style={{ height: `${logoHeight}px` }}
          />
        </div>
      </IonToolbar>
    </IonHeader>
  );
}
    