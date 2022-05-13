import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HelmetProvider } from 'react-helmet-async';
import StoreProvider from './Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Modal from 'react-modal/lib/components/Modal';

const root = ReactDOM.createRoot(document.getElementById('root'),Modal.setAppElement('#root'));
root.render(
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={true}>
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);

reportWebVitals();
