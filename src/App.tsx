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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Home} />
         {/* Nueva página de escaneo */}
          <Route path="/scan" component={Scan} exact />
          
        <Route exact path="/servicios/confirm" component={ServiceConfirm} />
        <Redirect to="/" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
