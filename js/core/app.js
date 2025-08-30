import { EventBus } from './event-bus.js';
import { DataLoader } from '../data/data-loader.js';
import { DataStore } from '../data/data-store.js';
import { ThemeManager } from '../utils/theme-manager.js';
import { AuthService } from '../services/auth-service.js';
import { Header } from '../ui/components/header/header.js';
import { Navigation } from '../ui/components/navigation/navigation.js';
import { Footer } from '../ui/components/footer/footer.js';
import { AboutView } from '../ui/views/about/about-view.js';
import { ExperienceView } from '../ui/views/experience/experience-view.js';
import { ProjectsView } from '../ui/views/projects/projects-view.js';
import { SkillsView } from '../ui/views/skills/skills-view.js';
import { ToolsView } from '../ui/views/tools/tools-view.js';
import { CertificationsView } from '../ui/views/certifications/certifications-view.js';
import { ContactView } from '../ui/views/contact/contact-view.js';

class App {
    constructor() {
        this.eventBus = new EventBus();
        this.dataLoader = new DataLoader();
        this.dataStore = new DataStore(this.eventBus);
        this.themeManager = new ThemeManager(this.eventBus);
        this.authService = new AuthService(this.eventBus);
        
        this.currentLanguage = 'es';
        this.currentSection = 'about';
        this.isAuthenticated = false;
        
        this.init();
    }
    
    async init() {
        // Cargar configuración inicial
        await this.loadInitialData();
        
        // Inicializar componentes
        this.initComponents();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar sección inicial
        this.loadSection(this.currentSection);
        
        console.log('Aplicación inicializada correctamente');
    }
    
    async loadInitialData() {
        try {
            // Cargar datos en el idioma actual
            const data = await this.dataLoader.load(this.currentLanguage);
            this.dataStore.setData(data);
            
            // Aplicar tema guardado o por defecto
            const savedTheme = localStorage.getItem('theme') || 'classic';
            this.themeManager.setTheme(savedTheme);
            
            // Verificar autenticación
            this.isAuthenticated = this.authService.isAuthenticated();
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            // Usar datos de respaldo en caso de error
            this.dataStore.setData(this.getFallbackData());
        }
    }
    
    initComponents() {
        // Inicializar componentes UI
        this.header = new Header({
            container: document.getElementById('header-container'),
            eventBus: this.eventBus,
            dataStore: this.dataStore
        });
        
        this.navigation = new Navigation({
            container: document.getElementById('nav-container'),
            eventBus: this.eventBus,
            dataStore: this.dataStore
        });
        
        this.footer = new Footer({
            container: document.getElementById('footer-container'),
            eventBus: this.eventBus,
            dataStore: this.dataStore
        });
        
        // Inicializar vistas
        this.views = {
            about: new AboutView({
                container: document.getElementById('about-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            experience: new ExperienceView({
                container: document.getElementById('experience-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            projects: new ProjectsView({
                container: document.getElementById('projects-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            skills: new SkillsView({
                container: document.getElementById('skills-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            tools: new ToolsView({
                container: document.getElementById('tools-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            certifications: new CertificationsView({
                container: document.getElementById('certifications-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            }),
            contact: new ContactView({
                container: document.getElementById('contact-section'),
                eventBus: this.eventBus,
                dataStore: this.dataStore
            })
        };
    }
    
    setupEventListeners() {
        // Escuchar cambios de idioma
        this.eventBus.on('language:changed', (data) => {
            this.changeLanguage(data.language);
        });
        
        // Escuchar cambios de sección
        this.eventBus.on('section:changed', (data) => {
            this.loadSection(data.section);
        });
        
        // Escuchar solicitudes de login
        this.eventBus.on('auth:login', (data) => {
            this.authService.login(data.username, data.password);
        });
        
        // Escuchar cambios de autenticación
        this.eventBus.on('auth:changed', (data) => {
            this.isAuthenticated = data.authenticated;
            this.eventBus.emit('ui:update', { authenticated: this.isAuthenticated });
        });
        
        // Escuchar solicitudes de exportación
        this.eventBus.on('export:request', (data) => {
            this.handleExportRequest(data.format, data.template);
        });
    }
    
    async changeLanguage(language) {
        try {
            const data = await this.dataLoader.load(language);
            this.dataStore.setData(data);
            this.currentLanguage = language;
            localStorage.setItem('language', language);
            
            // Actualizar toda la UI
            this.eventBus.emit('ui:update', { language: language });
            
        } catch (error) {
            console.error('Error changing language:', error);
        }
    }
    
    loadSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.view-section').forEach(el => {
            el.classList.add('hidden');
        });
        
        // Mostrar la sección solicitada
        document.getElementById(`${section}-section`).classList.remove('hidden');
        
        // Actualizar navegación
        this.eventBus.emit('navigation:update', { section: section });
        
        this.currentSection = section;
    }
    
    async handleExportRequest(format, template) {
        try {
            const data = this.dataStore.getData();
            const exporter = await import(`../utils/export/${format}-exporter.js`);
            const blob = await exporter.exportCV(data, this.currentLanguage, template);
            
            // Descargar el archivo
            saveAs(blob, `CV_José_Carlos_Castillo.${format}`);
            
            this.eventBus.emit('export:complete', { 
                format: format, 
                success: true 
            });
            
        } catch (error) {
            console.error('Export error:', error);
            this.eventBus.emit('export:complete', { 
                format: format, 
                success: false,
                error: error.message 
            });
        }
    }
    
    getFallbackData() {
        // Datos de respaldo en caso de error de carga
        return {
            header: {
                title: "José Carlos Castillo",
                subtitle: "Líder Técnico & Ingeniero de Datos"
            },
            about: {
                title: "Acerca de mí",
                content: "Ingeniero de Datos con más de 14 años de experiencia..."
            },
            // ... más datos de respaldo
        };
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Exponer la aplicación globalmente para depuración
window.App = App;