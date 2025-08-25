import { initApp } from './app.js';
import { EventBus } from './event-bus.js';
import { DataStore } from '../data/data-store.js';
import { ThemeManager } from '../utils/theme-manager.js';

// Inicializar servicios globales
const eventBus = new EventBus();
const dataStore = new DataStore();
const themeManager = new ThemeManager();

// Configurar el objeto global de la aplicación
window.app = {
  eventBus,
  dataStore,
  themeManager,
  config: {
    defaultTheme: 'classic',
    defaultLang: 'es',
    apiEndpoints: {
      cvData: 'data/cv.json'
    }
  }
};

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});