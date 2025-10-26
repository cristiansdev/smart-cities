import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';

/* Core CSS */
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

/* ❌ NO dark mode */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme */
import './theme/variables.css';
import './theme/banorte.css';
import Scan from './pages/Scan';
import ServiceConfirm from './pages/ServiceConfirm';
import Payments from './pages/Payments';
import EcoCashPart1 from './pages/EcoCashPart1/EcoCashPart1';

/* Ionic Core CSS */
import '@ionic/react/css/core.css';

/* Ionic Core CSS */
import '@ionic/react/css/core.css';

/* Basic Ionic CSS */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional Utilities */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import PagarServicio from './pages/PagarServicio/PagarServicio';
import OperacionExitosa from './pages/OperacionExitosa/OperacionExitosa';
import DescripcionEcocash from './pages/DescripcionEcocash/DescripcionEcocash';
import TerminosCondiciones from './pages/TerminosCondiciones';



setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Home} />
         {/* Nueva página de escaneo */}
          <Route path="/scan" component={Scan} exact />
          
        <Route exact path="/servicios/confirm" component={ServiceConfirm} />
         <Route exact path="/eco-cash-part-1" component={EcoCashPart1} />
                    <Route exact path="/pagar-servicio" component={PagarServicio} />
                               <Route exact path="/pagar-servicio" component={PagarServicio} />
        <Route exact path="/operacion-exitosa" component={OperacionExitosa} />
                <Route exact path="/descripcion-ecocash" component={DescripcionEcocash} />
                
         <Route exact path="/terminos-condiciones">
            <TerminosCondiciones
              isOpen={true}
              onClose={() => window.history.back()}
              onAccept={() => alert('Términos aceptados ✅')}
              onDecline={() => alert('Términos rechazados ❌')}
            />
          </Route>

        {/* Página de pagos */}
          <Route exact path="/payments">
            <Payments />
          </Route>
        <Redirect to="/" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
