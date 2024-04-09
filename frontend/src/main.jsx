import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import configureStore from './store';
import { restoreCSRF, csrfFetch } from './store/csrf';
import { ModalProvider, Modal} from './context/Modal';

import { loginThunk, restoreUserThunk, signUpThunk, logoutThunk} from './store/session';


const store = configureStore()

if (import.meta.env.MODE !== 'production') {
  restoreCSRF();
  
  window.csrfFetch = csrfFetch;
  window.store = store;
  window.loginThunk = loginThunk
  window.restoreUserThunk = restoreUserThunk
  window.signUpThunk = signUpThunk
  window.logoutThunk = logoutThunk
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal/>
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
