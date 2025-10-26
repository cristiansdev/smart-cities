import React, { useRef, useState } from 'react';
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
  IonCardContent,
} from '@ionic/react';
import { personCircleOutline, notificationsOutline, searchOutline } from 'ionicons/icons';
import './Payments.css';
import ServiceSheet from '../shared/ServiceSheet';

type Service = {
  id: number;
  name: string;
  logo: string;
  subtitle?: string | null;
};

const Payments: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [activeChip, setActiveChip] = useState<'Destacados' | 'Luz' | 'Agua'>('Destacados');
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const pageRef = useRef<HTMLElement | null>(null);

  const quickActions = [
    { id: 1, icon: '/assets/money.png' },
    { id: 2, icon: '/assets/money.png' },
    { id: 3, icon: '/assets/nose.png' },
    { id: 4, icon: '/assets/money.png' },
  ];

  const featuredServices: Service[] = [
    { id: 1, name: 'Luz', logo: '/assets/logo_cfe.png' },
    { id: 2, name: 'Agua', logo: '/assets/logo_agua.png' },
  ];

  const allServices: Service[] = [
    { id: 1, name: 'CFE', logo: '/assets/logo_cfe.png', subtitle: null },
    { id: 2, name: 'Agua y Drenaje Monterrey', logo: '/assets/logo_agua.png' },
    { id: 3, name: 'Total Play', logo: '/assets/total.png' },
    { id: 4, name: 'Gas Natural de México', logo: '/assets/gas-natural-mexico.png' },
  ];

  const getService = (id: number | null): Service | undefined =>
    allServices.find((s) => s.id === id);

  const handleServiceClick = (serviceId: number) => {
    setSelectedService(serviceId);
    setOpenSheet(true);
  };

  const filteredServices = allServices
    .filter((s) => {
      if (activeChip === 'Destacados') return true;
      if (activeChip === 'Luz') return s.name.toLowerCase().includes('cfe');
      if (activeChip === 'Agua') return s.name.toLowerCase().includes('agua');
      return true;
    })
    .filter((s) => s.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <IonPage ref={pageRef}>
      <IonHeader className="payments-header">
        <IonToolbar>
          <div className="header-content">
            <IonTitle className="header-title">PAGOS</IonTitle>
            <div className="header-icons">
              <IonIcon icon={notificationsOutline} className="header-icon" />
              <IonIcon icon={personCircleOutline} className="header-icon profile-icon" />
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className={`payments-content ${openSheet ? 'sheet-open' : ''}`}>
        {/* Banner rojo superior */}
        <div className="user-section-red">
          <div className="user-info-symmetric">
            <div className="user-image-container">
              <img src="/assets/user.png" alt="Usuario" className="user-image" />
            </div>
            <div className="user-info-centered">
              <IonText>
                <h2 className="user-greeting">Hola HANNIA</h2>
                <p className="last-access">Último ingreso</p>
                <p className="access-details">14-10-2025 22:10:01 Via Móvil</p>
              </IonText>
            </div>
            <div className="noti-container-small">
              <img src="/assets/noti.png" alt="Notificaciones" className="noti-image-small" />
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="quick-actions-section">
          <IonGrid className="quick-actions-grid">
            <IonRow>
              {quickActions.map((action, i) => (
                <IonCol size="3" key={action.id}>
                  <div className={`quick-action-item ${i === 2 ? 'qa-active' : ''}`}>
                    <div className="action-icon">
                      <img src={action.icon} alt="" className="action-icon-img" />
                    </div>
                  </div>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Botón “Pagar servicio” */}
        <div className="pay-service-section">
          <button className="pay-service-btn" type="button" aria-label="Pagar servicio">
            <div className="btn-content">
              <img src="/assets/money.png" alt="" className="btn-icon" />
              <span>Pagar Servicio</span>
            </div>
            <div className="checkmark">✔</div>
          </button>
        </div>

        {/* Buscador */}
        <div className="search-section">
          <div className="custom-search-container">
            <IonIcon icon={searchOutline} className="search-icon-large" />
            <IonSearchbar
              value={searchText}
              onIonInput={(e) => setSearchText(e.detail.value!)}
              placeholder="Buscar por nombre o tipo"
              className="custom-searchbar-improved"
              enterkeyhint="search"
            />
            <button className="search-btn" aria-label="Buscar" type="button">
              <IonIcon icon={searchOutline} />
            </button>
          </div>

          <div className="filter-chips">
            {(['Destacados', 'Luz', 'Agua'] as const).map((chip) => (
              <button
                key={chip}
                type="button"
                className={`bn-chip ${activeChip === chip ? 'bn-chip-active' : ''}`}
                onClick={() => setActiveChip(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Destacados */}
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
                        <img src={service.logo} alt={service.name} className="service-logo" />
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

        <div className="divider" />

        {/* Lista de servicios */}
        <div className="all-services-section">
          <IonText className="section-title">
            <h3>Servicios Disponibles</h3>
          </IonText>

          <div className="services-list">
            {filteredServices.map((service, index) => (
              <React.Fragment key={service.id}>
                <IonCard
                  className={[
                    'service-item',
                    selectedService === service.id && openSheet ? 'service-selected' : '',
                    hoveredService === service.id && !(selectedService === service.id && openSheet)
                      ? 'service-hover'
                      : '',
                  ].join(' ')}
                  onClick={() => handleServiceClick(service.id)}
                  onMouseEnter={() => setHoveredService(service.id)}
                  onMouseLeave={() => setHoveredService(null)}
                >
                  <IonCardContent className="service-item-content">
                    <div className="service-info">
                      <img src={service.logo} alt={service.name} className="service-logo-small" />
                      <div className="service-text-container">
                        <IonText>
                          <p className="service-text">{service.name}</p>
                        </IonText>
                      </div>
                    </div>
                    <div className="service-arrow">›</div>
                  </IonCardContent>
                </IonCard>

                {index === 0 && <div className="service-divider" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom-sheet */}
        <ServiceSheet
          isOpen={openSheet}
          presentingElement={pageRef.current}
          service={getService(selectedService) || null}
          onDismiss={() => setOpenSheet(false)}
          onContinue={(payload) => {
            console.log('Continuar con:', payload);
            setOpenSheet(false);
          }}
        />
      </IonContent>
    </IonPage>
  );
};

export default Payments;
