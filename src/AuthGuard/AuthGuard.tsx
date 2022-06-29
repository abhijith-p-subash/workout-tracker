import { useIonViewWillEnter } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Route, Redirect,  } from "react-router-dom";
import { auth } from '../firebase/FireBase-config';


const AuthGuard = ({ component: Component, auth, ...rest }: any) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      if (auth.currentUser?.uid) {
        setIsAuthenticated(true);
      }
    },[])

    return <Route {...rest} render={(props) => (
        isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
    )} />
}

export default AuthGuard;