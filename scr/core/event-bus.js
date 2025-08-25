/**
 * Sistema de eventos centralizado para comunicación entre módulos
 * Patrón Observer para desacoplar componentes
 */
export class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * Suscribirse a un evento
   * @param {string} eventName - Nombre del evento
   * @param {function} callback - Función a ejecutar cuando se dispare el evento
   * @returns {function} Función para desuscribirse
   */
  on(eventName, callback) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    this.events.get(eventName).add(callback);
    
    // Devolver función para desuscribirse
    return () => {
      this.events.get(eventName).delete(callback);
    };
  }

  /**
   * Disparar un evento
   * @param {string} eventName - Nombre del evento
   * @param {any} data - Datos a enviar con el evento
   */
  emit(eventName, data = null) {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error executing event handler for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * Desuscribir todos los callbacks de un evento
   * @param {string} eventName - Nombre del evento
   */
  off(eventName) {
    this.events.delete(eventName);
  }
}