/**
 * Gestiona los temas visuales de la aplicación
 */
export class ThemeManager {
  constructor() {
    this.availableThemes = [
      { id: 'classic', name: 'Clásico', preview: 'src/themes/classic/preview.png' },
      { id: 'dark', name: 'Modo Oscuro', preview: 'src/themes/dark/preview.png' },
      { id: 'linkedin', name: 'LinkedIn', preview: 'src/themes/linkedin/preview.png' },
      { id: 'neumorphism', name: 'Neumorfismo', preview: 'src/themes/neumorphism/preview.png' },
      { id: 'darkpunk', name: 'Dark Punk', preview: 'src/themes/darkpunk/preview.png' },
      { id: 'neon', name: 'Neon', preview: 'src/themes/neon/preview.png' }
    ];
    
    this.currentTheme = this._getSavedTheme() || window.app.config.defaultTheme;
    this.themeLink = document.getElementById('theme-stylesheet');
    
    this._applyTheme(this.currentTheme);
  }

  /**
   * Aplica un tema específico
   * @param {string} themeId - ID del tema a aplicar
   */
  setTheme(themeId) {
    const theme = this.availableThemes.find(t => t.id === themeId);
    if (!theme) {
      console.error(`Theme ${themeId} not found`);
      return;
    }
    
    this.currentTheme = theme.id;
    this._applyTheme(theme.id);
    this._saveTheme(theme.id);
    
    // Notificar cambio de tema
    window.app.eventBus.emit('theme:changed', { theme: theme.id });
  }

  /**
   * Obtiene la lista de temas disponibles
   * @returns {Array} Lista de temas
   */
  getThemes() {
    return [...this.availableThemes];
  }

  /**
   * Aplica el tema al documento
   * @param {string} themeId - ID del tema
   */
  _applyTheme(themeId) {
    if (!this.themeLink) {
      console.error('Theme stylesheet link not found');
      return;
    }
    
    this.themeLink.href = `src/themes/${themeId}/theme.css`;
    document.documentElement.setAttribute('data-theme', themeId);
  }

  /**
   * Guarda el tema seleccionado
   * @param {string} themeId - ID del tema
   */
  _saveTheme(themeId) {
    try {
      localStorage.setItem('portfolio-theme', themeId);
    } catch (e) {
      console.warn('Could not save theme to localStorage', e);
    }
  }

  /**
   * Obtiene el tema guardado
   * @returns {string|null} ID del tema guardado
   */
  _getSavedTheme() {
    try {
      return localStorage.getItem('portfolio-theme');
    } catch (e) {
      console.warn('Could not read theme from localStorage', e);
      return null;
    }
  }
}

// Inicializar y exportar una instancia única
const themeManager = new ThemeManager();
export default themeManager;

// Configurar en el objeto global de la aplicación
document.addEventListener('DOMContentLoaded', () => {
  window.app.themeManager = themeManager;
});