import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import logo from './components/photo/logo.png';

// تغيير عنوان الصفحة
document.title = 'UsedShop';

// تغيير الأيقونة (favicon)
const favicon = document.createElement('link');
favicon.rel = 'icon';
favicon.href = logo; //
document.head.appendChild(favicon);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
