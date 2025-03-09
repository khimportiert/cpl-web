import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthProvider';
import { CaptionProvider } from './context/CaptionProvider';
import { NotificationCountProvider } from './context/NotificationCountProvider';
import { CssBaseline } from '@mui/material';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CssBaseline>
        <AuthProvider>
          <NotificationCountProvider>
            <CaptionProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </CaptionProvider>
          </NotificationCountProvider>
        </AuthProvider>
      </CssBaseline>
    </BrowserRouter>
  </React.StrictMode>
);
