import { jsPDF } from 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

/**
 * Genera CV en formato PDF
 */
export class PDFExporter {
  /**
   * Genera el PDF del CV
   * @param {object} data - Datos del CV
   * @param {string} template - Plantilla a usar
   * @returns {Promise<Blob>} Blob del PDF generado
   */
  static async generate(data, template = 'professional') {
    return new Promise((resolve, reject) => {
      try {
        // Configurar el documento
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Configurar colores según la plantilla
        const colors = this._getTemplateColors(template);
        
        // Añadir contenido
        this._addHeader(doc, data, colors);
        this._addAboutSection(doc, data, colors);
        this._addExperienceSection(doc, data, colors);
        this._addSkillsSection(doc, data, colors);
        this._addCertificationsSection(doc, data, colors);
        this._addProjectsSection(doc, data, colors);
        
        // Obtener el blob
        const blob = doc.output('blob');
        resolve(blob);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Configura los colores según la plantilla
   * @param {string} template - Nombre de la plantilla
   * @returns {Object} Objeto con los colores
   */
  static _getTemplateColors(template) {
    const templates = {
      professional: {
        primary: [52, 152, 219], // Azul
        secondary: [44, 62, 80],  // Gris oscuro
        accent: [231, 76, 60]     // Rojo
      },
      modern: {
        primary: [108, 92, 231], // Púrpura
        secondary: [162, 155, 254],
        accent: [230, 126, 34]    // Naranja
      },
      minimalist: {
        primary: [0, 210, 211],  // Turquesa
        secondary: [10, 189, 227],
        accent: [46, 204, 113]    // Verde
      }
    };
    
    return templates[template] || templates.professional;
  }

  /**
   * Añade el encabezado al documento
   */
  static _addHeader(doc, data, colors) {
    // Logo o nombre
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.text(data.about.name, 20, 25);
    
    // Título
    doc.setFontSize(16);
    doc.setTextColor(...colors.secondary);
    doc.text(data.about.title, 20, 35);
    
    // Línea decorativa
    doc.setDrawColor(...colors.primary);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
  }

  /**
   * Añade la sección de información personal
   */
  static _addAboutSection(doc, data, colors) {
    let yPos = 50;
    
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text('Perfil Profesional', 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    
    // Dividir el texto en líneas
    const lines = doc.splitTextToSize(data.about.description, 170);
    doc.text(lines, 20, yPos);
    
    yPos += lines.length * 6 + 10;
    return yPos;
  }

  // Métodos similares para las otras secciones...
  static _addExperienceSection(doc, data, colors) {
    // Implementación similar para la sección de experiencia
  }
  
  static _addSkillsSection(doc, data, colors) {
    // Implementación similar para la sección de habilidades
  }
  
  static _addCertificationsSection(doc, data, colors) {
    // Implementación similar para la sección de certificaciones
  }
  
  static _addProjectsSection(doc, data, colors) {
    // Implementación similar para la sección de proyectos
  }
}

// Hacer disponible globalmente para los componentes
document.addEventListener('DOMContentLoaded', () => {
  window.PDFExporter = PDFExporter;
});