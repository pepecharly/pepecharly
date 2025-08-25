import { DataStore } from './data-store.js';
import { EventBus } from '../core/event-bus.js';

/**
 * Carga y gestiona los datos del portafolio
 */
export class DataLoader {
  constructor() {
    this.dataStore = new DataStore();
    this.eventBus = new EventBus();
    this.isDataLoaded = false;
  }

  /**
   * Carga los datos desde el archivo JSON
   * @param {string} lang - Idioma a cargar (es/en)
   * @returns {Promise<object>} Datos cargados
   */
  async load(lang = 'es') {
    try {
      // Mostrar pantalla de carga
      this.eventBus.emit('loading');
      
      // Construir la ruta del archivo
      const dataPath = `data/cv_${lang}.json`;
      
      // Cargar los datos
      const response = await fetch(dataPath);
      
      // Si falla, intentar con ruta relativa alternativa
      if (!response.ok) {
        const altResponse = await fetch(`./${dataPath}`);
        if (!altResponse.ok) {
          throw new Error(`Error loading data for language: ${lang}`);
        }
        this._processData(await altResponse.json(), lang);
      } else {
        this._processData(await response.json(), lang);
      }
      
      this.isDataLoaded = true;
      return this.dataStore.getData();
    } catch (error) {
      console.error('Error loading ', error);
      
      // Intentar cargar datos en español como fallback
      if (lang !== 'es') {
        return this.load('es');
      }
      
      // Si todo falla, usar datos de ejemplo
      this._loadFallbackData();
      return this.dataStore.getData();
    }
  }

  /**
   * Procesa los datos cargados
   * @param {object} data - Datos cargados
   * @param {string} lang - Idioma actual
   */
  _processData(data, lang) {
    this.dataStore.setData(data);
    this.dataStore.setLang(lang);
    
    // Notificar que los datos están listos
    this.eventBus.emit('loaded', { lang, data });
  }

  /**
   * Carga datos de ejemplo en caso de error
   */
  _loadFallbackData() {
    const fallbackData = {
      lang: 'es',
      about: {
        name: 'Jose Carlos Castillo (PepeCharly)',
        title: 'Líder Técnico | Data Engineer especializado en ETL, Big Data & GCP',
        description: 'Profesional altamente calificado en ingeniería de datos con más de 10 años de experiencia...'
      },
      // ... otros datos de ejemplo
    };
    
    this._processData(fallbackData, 'es');
  }
}

// Inicializar y exportar una instancia única
const dataLoader = new DataLoader();
export default dataLoader;

// Configurar listeners globales
document.addEventListener('DOMContentLoaded', () => {
  window.app.eventBus.on('language:changed', (lang) => {
    dataLoader.load(lang);
  });
  
  window.app.eventBus.on('app:init', () => {
    dataLoader.load(window.app.config.defaultLang);
  });
});