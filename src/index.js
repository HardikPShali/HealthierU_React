import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import './i18n';
import i18next from 'i18next';
// import Maintenance from '.maintenance-page/maintenance'
// import Admin from './components/AdminModule/Admin'

import * as registerServiceWorker from './registerServiceWorker';
// import { isMoment } from 'moment';

const language= localStorage.getItem('language') || 'en'

axios.defaults.headers.common['Accept-Language'] = language;
i18next.changeLanguage(language);

ReactDOM.render( <App /> , document.getElementById('root'));
// registerServiceWorker();
registerServiceWorker.unregister();
