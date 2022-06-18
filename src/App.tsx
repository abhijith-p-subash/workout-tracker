import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact, useIonViewWillEnter, useIonViewDidEnter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { auth } from './firebase/FireBase-config';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Menu from "./components/Menu/Menu";
import Info from "./pages/Info/Info";
import Profile from "./pages/Profile/Profile";
import EditProfile from "./pages/EditProfile/EditProfile";
import Calculator from "./pages/Calculator/Calculator";
import Progress from "./pages/Progress/Progress";
import Verification from "./pages/Verification/RestPassword";
import AuthGurad from "./AuthGuard/AuthGuard";



setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log(auth.currentUser?.uid);
    if (auth.currentUser?.uid) {
      setIsAuthenticated(true);
    }
    console.log(isAuthenticated);
  },[])

    useIonViewWillEnter(() => {
      console.log(auth.currentUser?.uid);
      if (auth.currentUser?.uid) {
        setIsAuthenticated(true);
      }
      console.log(isAuthenticated);
      
    },[]);
 
  

  return <IonApp>
    <IonReactRouter>
      <Menu ctrl={true} />
      <IonRouterOutlet>
        {/* <AuthGurad auth={isAuthenticated} path="/" component={Login} />
        <AuthGurad auth={isAuthenticated} path="/home" component={Home} />
        <AuthGurad auth={isAuthenticated} path="/info/:wrkout/:id" component={Info} />
        <AuthGurad auth={isAuthenticated} path="/profile" component={Profile} />
        <AuthGurad auth={isAuthenticated} path="/update-profile/:id" component={EditProfile } />
        <AuthGurad auth={isAuthenticated} path="/bmi-calculator" component={Calculator} />
        <AuthGurad auth={isAuthenticated} path="/progress" component={Progress} /> */}
        

{/* <Route
  exact
  path="/home"
  render={(props) => {
    return isAuthenticated ? <Home /> : <Redirect to="/login" />;
  }}
/>
<Route
  exact
  path="/"
  render={(props) => {
    return isAuthenticated ? <Home /> : <Redirect to="/login" />;
  }}
/> */}
        <Route exact path="/home" ><Home/></Route>
        <Route exact path="/">{auth.currentUser?.uid ? <Redirect to="/home" /> :<Redirect to="/login" />}</Route>
        <Route exact path="/info/:wrkout/:id"><Info /></Route>
        <Route exact path="/profile"><Profile /></Route>
        <Route exact path="/update-profile/:id"><EditProfile /></Route>
        <Route exact path="/bmi-calculator"><Calculator /></Route>
        <Route exact path="/progress"><Progress /></Route>
        <Route exact path="/login"><Login /></Route>
        <Route exact path="/register"><Register /></Route>
        <Route exact path="/resetpassword"><Verification /></Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
};

export default App;
