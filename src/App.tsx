import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import Scanner from './pages/Scanner/Scanner';
import PagarServicio from './pages/PagarServicio/PagarServicio';

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

/* Dark Mode (optional) */
// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home" component={Home} />
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route exact path="/scanner" component={Scanner} />
        <Route exact path="/pagar-servicio" component={PagarServicio} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;