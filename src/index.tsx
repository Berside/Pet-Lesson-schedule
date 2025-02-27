import React, { createContext } from 'react';
import App from './App.tsx';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);
root.render(
      <App />
);