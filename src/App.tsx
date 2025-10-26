import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Pages */
import Home from "./pages/Home";
import Scanner from "./pages/Scanner/Scanner";
import PagarServicio from "./pages/PagarServicio/PagarServicio";
import OperacionExitosa from "./pages/OperacionExitosa/OperacionExitosa";
import EcoCashPart1 from "./pages/EcoCashPart1/EcoCashPart1";

/* Ionic Core CSS */
import "@ionic/react/css/core.css";

/* Basic Ionic CSS */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional Utilities */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Dark Mode (optional) */
// import '@ionic/react/css/palettes/dark.always.css';
// import '@ionic/react/css/palettes/dark.class.css';
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import DescripcionEcocash from "./pages/DescripcionEcocash/DescripcionEcocash";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Página principal */}
        <Route exact path="/home" component={Home} />

        {/* Redirección por defecto */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />

        {/* Otras rutas */}
        <Route exact path="/scanner" component={Scanner} />
        <Route exact path="/pagar-servicio" component={PagarServicio} />
        <Route exact path="/operacion-exitosa" component={OperacionExitosa} />
        <Route exact path="/eco-cash-part-1" component={EcoCashPart1} />
        <Route exact path="/descripcion-ecocash" component={DescripcionEcocash} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
