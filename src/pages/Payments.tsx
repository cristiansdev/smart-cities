import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar, 
  IonSearchbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonIcon,
  IonText,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { cardOutline, personCircleOutline, notificationsOutline, searchOutline } from 'ionicons/icons';
import ServiceDetails from './ServiceDetails';
import './Payments.css';

const Payments: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);

  const quickActions = [
    { id: 1, icon: '/assets/money.png' },
    { id: 2, icon: '/assets/money.png' },
    { id: 3, icon: '/assets/nose.png' },
    { id: 4, icon: '/assets/money.png' }
  ];

  const featuredServices = [
    { 
      id: 1, 
      name: 'Luz', 
      logo: '/assets/logo_cfe.png'
    },
    { 
      id: 2, 
      name: 'Agua', 
      logo: '/assets/logo_agua.png'
    }
  ];

  const allServices = [
    { 
      id: 1, 
      name: 'CFE', 
      logo: '/assets/logo_cfe.png',
      subtitle: 'CFE'
    },
    { 
      id: 2, 
      name: 'Agua y Drenaje Monterrey', 
      logo: '/assets/logo_agua.png'
    },
    { 
      id: 3, 
      name: 'Total Play', 
      logo: '/assets/total.png'
    },
    { 
      id: 4, 
      name: 'Gas Natural de México', 
      logo: '/assets/gas-natural-mexico.png'
    }
  ];

  const handleServiceClick = (serviceId: number) => {
    const service = allServices.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(serviceId);
      setShowServiceDetails(true);
    }
  };

  const handleCloseDetails = () => {
    setShowServiceDetails(false);
    setSelectedService(null);
  };

  const getSelectedServiceData = () => {
    return allServices.find(service => service.id === selectedService) || allServices[0];
  };

  return (
    <IonPage>
      <IonHeader className="payments-header">
        <IonToolbar>
          <div className="header-content">
            <IonTitle className="header-title">PAGOS</IonTitle>
            <div className="header-icons">
              <IonIcon 
                icon={notificationsOutline} 
                className="header-icon"
              />
              <IonIcon 
                icon={personCircleOutline} 
                className="header-icon profile-icon"
              />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="payments-content">
        {/* Sección de bienvenida CON FONDO ROJO - SIMÉTRICA CON USER Y NOTI */}
        <div className="user-section-red">
          <div className="user-info-symmetric">
            {/* Imagen User a la izquierda */}
            <div className="user-image-container">
              <img 
                src="/assets/user.png" 
                alt="Usuario" 
                className="user-image"
              />
            </div>
            
            {/* Información del usuario centrada */}
            <div className="user-info-centered">
              <IonText>
                <h2 className="user-greeting">Hola HANNIA</h2>
                <p className="last-access">Último ingreso</p>
                <p className="access-details">14-10-2025 22:10:01 Via Móvil</p>
              </IonText>
            </div>
            
            {/* Imagen Noti a la derecha (más pequeña) */}
            <div className="noti-container-small">
              <img 
                src="/assets/noti.png" 
                alt="Notificaciones" 
                className="noti-image-small"
              />
            </div>
          </div>
        </div>

        {/* 4 Cuadritos de acciones rápidas - SIN ETIQUETAS */}
        <div className="quick-actions-section">
          <IonGrid className="quick-actions-grid">
            <IonRow>
              {quickActions.map((action) => (
                <IonCol size="3" key={action.id}>
                  <div className="quick-action-item">
                    <div className="action-icon">
                      <img 
                        src={action.icon} 
                        alt=""
                        className="action-icon-img"
                      />
                    </div>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Botón de pagar servicio */}
        <div className="pay-service-section">
          <button className="pay-service-btn">
            <div className="btn-content">
              <img src="/assets/money.png" alt="Pagar" className="btn-icon" />
              <span>Pagar Servicio</span>
            </div>
            <div className="checkmark">✔</div>
          </button>
        </div>

        {/* Barra de búsqueda MEJORADA */}
        <div className="search-section">
          <div className="custom-search-container">
            <IonIcon icon={searchOutline} className="search-icon-large" />
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Buscar por nombre o tipo"
              className="custom-searchbar-improved"
            />
          </div>
        </div>

        {/* Servicios destacados */}
        <div className="featured-section">
          <IonText className="section-title">
            <h3>Destacados</h3>
          </IonText>
          
          <IonGrid className="featured-grid">
            <IonRow>
              {featuredServices.map((service) => (
                <IonCol size="6" key={service.id}>
                  <IonCard className="featured-card">
                    <IonCardContent className="featured-content">
                      <div className="service-logo-container">
                        <img 
                          src={service.logo} 
                          alt={service.name}
                          className="service-logo"
                        />
                      </div>
                      <IonText className="service-name">
                        <p>{service.name}</p>
                      </IonText>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Línea divisoria */}
        <div className="divider"></div>

        {/* Todos los servicios */}
        <div className="all-services-section">
          <IonText className="section-title">
            <h3>Servicios Disponibles</h3>
          </IonText>
          
          <div className="services-list">
            {allServices.map((service, index) => (
              <React.Fragment key={service.id}>
                <IonCard 
                  className={`service-item ${selectedService === service.id ? 'service-selected' : ''}`}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <IonCardContent className="service-item-content">
                    <div className="service-info">
                      <img 
                        src={service.logo} 
                        alt={service.name}
                        className="service-logo-small"
                      />
                      <div className="service-text-container">
                        <IonText>
                          <p className="service-text">{service.name}</p>
                          {service.subtitle && (
                            <p className="service-subtext">{service.subtitle}</p>
                          )}
                        </IonText>
                      </div>
                    </div>
                    <div className="service-arrow">›</div>
                  </IonCardContent>
                </IonCard>
                
                {/* Línea divisoria después de CFE */}
                {index === 0 && <div className="service-divider"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Modal/Overlay de ServiceDetails */}
        {showServiceDetails && (
          <div className="service-details-overlay">
            <div className="service-details-modal">
              <ServiceDetails 
                service={getSelectedServiceData()}
                onClose={handleCloseDetails}
              />
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Payments;