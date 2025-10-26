import React from 'react';
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import {
  home,
  card,
  personCircle,
  notifications,
  location,
  qrCode
} from 'ionicons/icons';

/* Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme */
import './theme/variables.css';

/* Pages */
import Home from './pages/Home';
import Payments from './pages/Payments';
import TerminosCondiciones from './pages/TerminosCondiciones';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          {/* Página de inicio */}
          <Route exact path="/home">
            <Home />
          </Route>

          {/* Página de pagos */}
          <Route exact path="/payments">
            <Payments />
          </Route>

          {/* Página de términos */}
          <Route exact path="/terminos-condiciones">
            <TerminosCondiciones
              isOpen={true}
              onClose={() => window.history.back()}
              onAccept={() => alert('Términos aceptados ✅')}
              onDecline={() => alert('Términos rechazados ❌')}
            />
          </Route>

          {/* Redirección por defecto */}
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>

        <IonTabBar slot="bottom" className="custom-tab-bar">
          <IonTabButton tab="home" href="/home" className="tab-button">
            <IonIcon icon={home} className="tab-icon" />
            <IonLabel className="tab-label">Inicio</IonLabel>
          </IonTabButton>

          <IonTabButton tab="payments" href="/payments" className="tab-button">
            <IonIcon icon={card} className="tab-icon" />
            <IonLabel className="tab-label">Pagos</IonLabel>
          </IonTabButton>

          <IonTabButton tab="locations" href="/home" className="tab-button">
            <IonIcon icon={location} className="tab-icon" />
            <IonLabel className="tab-label">Ubicaciones</IonLabel>
          </IonTabButton>

          <IonTabButton tab="qr" href="/home" className="tab-button">
            <IonIcon icon={qrCode} className="tab-icon" />
            <IonLabel className="tab-label">QR</IonLabel>
          </IonTabButton>

          <IonTabButton tab="notifications" href="/home" className="tab-button">
            <IonIcon icon={notifications} className="tab-icon" />
            <IonLabel className="tab-label">Alertas</IonLabel>
            <IonBadge color="danger" className="notification-badge">
              3
            </IonBadge>
          </IonTabButton>

          <IonTabButton tab="profile" href="/home" className="tab-button">
            <IonIcon icon={personCircle} className="tab-icon" />
            <IonLabel className="tab-label">Perfil</IonLabel>
          </IonTabButton>

          {/* Tab de términos */}
          <IonTabButton
            tab="terminos-condiciones"
            href="/terminos-condiciones"
            className="tab-button"
          >
            <IonIcon icon={personCircle} className="tab-icon" />
            <IonLabel className="tab-label">Términos</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
