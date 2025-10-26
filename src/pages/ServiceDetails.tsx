import React from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonButton,
  IonIcon,
  IonText
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import './ServiceDetails.css';

interface ServiceDetailsProps {
  service: {
    id: number;
    name: string;
    logo: string;
    subtitle?: string;
  };
  onClose: () => void;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service, onClose }) => {
  return (
    <IonPage>
      <IonHeader className="service-details-header">
        <IonToolbar>
          <div className="header-content">
            <IonButton 
              fill="clear" 
              className="back-button"
              onClick={onClose}
            >
              <IonIcon icon={closeOutline} slot="start" />
              Cerrar
            </IonButton>
            <IonTitle className="header-title">{service.name}</IonTitle>
            <div style={{width: '72px'}}></div> {/* Espacio para mantener la simetría */}
          </div>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="service-details-content">
        {/* Solo la sección de referencia como en la imagen */}
        <div className="reference-modal-section">
          <div className="reference-header">
            <IonText>
              <h3 className="reference-title">Ingresa una referencia o escanea<br />el código de barras</h3>
            </IonText>
          </div>
          
          <div className="reference-input-section">
            <input 
              type="text" 
              placeholder="Referencia, cuenta, teléfono"
              className="reference-input"
            />
          </div>
          
          <div className="help-link-section">
            <a href="#" className="help-link">
              ¿Dónde encontrar estos datos en mi recibo?
            </a>
          </div>
          
          <div className="continue-button-section">
            <button className="continue-btn">
              Continuar
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ServiceDetails;