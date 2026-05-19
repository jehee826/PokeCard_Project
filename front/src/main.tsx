import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.tsx'
import SocketClient from './components/stomp/StompComponent.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>

      <App />

  </StrictMode>,
)
