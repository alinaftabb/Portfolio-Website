import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import { Login } from './components/auth/Login';
import Alert from './components/layout/Alert';
import Dashboard from './components/dasboard/Dashboard';
import AddExperience from './components/profile-forms/AddExperience';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import { Register } from './components/auth/Register';
import React, { Fragment, useEffect } from 'react';
//redux
import { connect, Provider, useSelector } from 'react-redux';
import store from './store';
import { loadUser, login, register } from './actions/auth';
import setAuthToken from './utils/setAuthToken';
import { setAlert } from './actions/alert';
import { createProfile } from './actions/profile';
import { useNavigate } from 'react-router';

if (localStorage.token) {
  setAuthToken(localStorage.token);
} else {
  <Navigate to={'/login'} />;
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  console.log(isAuthenticated);
  const nav = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      nav('/dashboard');
    }
  }, []);

  const authenticatedRoutes = [
    {
      url: '/dashboard',
      component: <Dashboard />,
    },
    {
      url: '/create-profile',
      component: <CreateProfile />,
    },
    {
      url: '/edit-profile',
      component: <EditProfile />,
    },
    {
      url: '/add-experience',
      component: <AddExperience />,
    },
  ];

  const unAuthenticatedRoutes = [
    { url: '/', component: <Landing /> },
    {
      url: '/register',
      component: <Register register={register} setAlert={setAlert} />,
    },
    { url: '/login', component: <Login login={login} /> },
  ];

  return (
    <Fragment>
      <Navbar />
      <section className='container'>
        <Alert />
        <Routes>
          {isAuthenticated ? (
            <>
              {authenticatedRoutes.map((data, i) => (
                <Route
                  key={i}
                  exact
                  path={`/${data.url}`}
                  element={data.component}
                />
              ))}
            </>
          ) : (
            unAuthenticatedRoutes.map((data, i) => (
              <Route
                key={i}
                exact
                path={`/${data.url}`}
                element={data.component}
              />
            ))
          )}
        </Routes>
      </section>
    </Fragment>
  );
};

export default connect(null, null)(App);
