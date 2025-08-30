import { EventBus } from './event-bus.js';
import { ThemeManager } from '../utils/theme-manager.js';
import { DataLoader } from '../data/data-loader.js';
import { DOMUtils } from '../utils/dom-utils.js';

class App {
    constructor() {
        this.eventBus = new EventBus();
        this.dataLoader = new DataLoader();
        this.themeManager = new ThemeManager(this.eventBus);
        this.domUtils = new DOMUtils();
        this.currentLang = 'es';
        this.init();
    }

    async init() {
        this.setupHeader();
        this.setupMain();
        await this.loadAndRender();
        this.bindEvents();
        this.themeManager.applySavedTheme();
        this.adjustPadding();
        window.addEventListener('resize', () => this.adjustPadding());
    }

    setupHeader() {
        const header = document.createElement('header');
        header.className = 'header fixed top-0 left-0 w-full z-50 bg-header transition-colors duration-300';
        header.innerHTML = `
            <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
                <a href="#" class="flex items-center space-x-2 text-xl font-bold text-primary">
                    <i class="fas fa-user-tie"></i>
                    <span data-i18n="name">José Carlos Castillo</span>
                </a>
                <div class="flex items-center space-x-4">
                    <button id="export-btn" class="btn btn-secondary">
                        <i class="fas fa-file-export"></i><span data-i18n="export">Exportar</span>
                    </button>
                    <button id="lang-toggle" class="p-2 rounded-full bg-secondary text-text hover:bg-secondary-hover">
                        <i class="fas fa-language"></i>
                    </button>
                    <button id="theme-toggle" class="p-2 rounded-full bg-secondary text-text hover:bg-secondary-hover">
                        <i class="fas fa-palette"></i>
                    </button>
                </div>
            </nav>
            <div id="mobile-nav" class="hidden"></div>
        `;
        document.body.appendChild(header);
    }

    setupMain() {
        const main = document.createElement('main');
        main.innerHTML = `
            <div class="container">
                <div class="main-grid">
                    <div id="main-content" class="space-y-8"></div>
                    <div id="sidebar" class="space-y-8"></div>
                </div>
            </div>
        `;
        document.body.appendChild(main);
    }

    async loadAndRender() {
        const data = await this.dataLoader.load(this.currentLang);
        this.renderAbout(data);
        this.renderExperience(data);
        this.renderProjects(data);
        this.renderSkills(data);
        this.renderTools(data);
        this.renderContact(data);
        this.i18n();
    }

    renderAbout(data) {
        const section = document.createElement('section');
        section.id = 'about';
        section.className = 'card scroll-mt-24';
        section.innerHTML = `
            <div class="flex items-center space-x-8 mb-6">
                <img src="assets/img/profile.jpg" alt="Foto de perfil" class="rounded-full w-28 h-28 object-cover shadow-lg">
                <div>
                    <h1 class="text-3xl font-bold text-primary" data-i18n="name">${data.about.name}</h1>
                    <h2 class="text-xl font-medium text-secondary mt-1">${data.about.title}</h2>
                    <p class="text-tertiary text-sm mt-1">${data.about.location}</p>
                </div>
            </div>
            <p class="text-text leading-relaxed mb-6">${data.about.description}</p>
            <div class="flex flex-wrap gap-4">
                <a href="mailto:${data.about.email}" class="btn btn-primary">
                    <i class="fas fa-envelope"></i><span data-i18n="contact_me">Contáctame</span>
                </a>
                <button id="export-pdf-btn" class="btn btn-secondary">
                    <i class="fas fa-file-pdf"></i><span data-i18n="download_pdf">PDF</span>
                </button>
                <button id="export-docx-btn" class="btn btn-secondary">
                    <i class="fas fa-file-word"></i><span data-i18n="download_docx">DOCX</span>
                </button>
            </div>
        `;
        document.getElementById('main-content').appendChild(section);
    }

    renderExperience(data) {
        const container = document.createElement('section');
        container.id = 'experience';
        container.className = 'card scroll-mt-24';
        container.innerHTML = `
            <h3 class="text-2xl font-bold text-heading mb-6" data-i18n="experience">Experiencia</h3>
            <div id="experience-items" class="space-y-6"></div>
            <div class="text-center mt-6">
                <button id="toggle-experience" class="btn btn-secondary">
                    <span data-i18n="show_more">Mostrar más</span>
                </button>
            </div>
        `;
        document.getElementById('main-content').appendChild(container);
        this.renderExperienceItems(data.experience);
    }

    renderExperienceItems(items) {
        const container = document.getElementById('experience-items');
        const visible = this.expanded ? items : items.slice(0, 2);
        container.innerHTML = visible.map((exp, i) => `
            <div class="border-l-4 border-primary pl-6 space-y-2 relative">
                <span class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">${i+1}</span>
                <h4 class="font-bold text-lg">${exp.title}</h4>
                <p class="text-secondary">${exp.company} | ${exp.period}</p>
                <ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>
            </div>
        `).join('');
    }

    renderProjects(data) {
        const section = document.createElement('section');
        section.id = 'projects';
        section.className = 'card scroll-mt-24';
        section.innerHTML = `
            <h3 class="text-2xl font-bold text-heading mb-6" data-i18n="projects">Proyectos</h3>
            <div id="projects-container" class="space-y-6"></div>
        `;
        document.getElementById('main-content').appendChild(section);
        const container = document.getElementById('projects-container');
        container.innerHTML = data.projects.map(p => `
            <div class="bg-card-light p-6 rounded-xl border border-border">
                <h4 class="font-bold text-lg">${p.title}</h4>
                <p class="text-text">${p.description}</p>
                <a href="${p.link}" class="text-primary font-semibold mt-2 inline-block hover:underline">
                    <i class="${p.icon} mr-1"></i>${p.text}
                </a>
            </div>
        `).join('');
    }

    renderSkills(data) {
        const section = document.createElement('section');
        section.id = 'skills';
        section.className = 'card scroll-mt-24';
        section.innerHTML = `
            <h3 class="text-2xl font-bold text-heading mb-6" data-i18n="skills">Habilidades</h3>
            <div id="skills-container" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
        `;
        document.getElementById('main-content').appendChild(section);
        const container = document.getElementById('skills-container');
        container.innerHTML = data.skills.map(s => `
            <div class="bg-card-light p-4 rounded-xl flex items-center justify-center">
                <p class="text-lg font-medium">${s}</p>
            </div>
        `).join('');
    }

    renderTools(data) {
        const section = document.createElement('section');
        section.id = 'tools';
        section.className = 'card scroll-mt-24';
        section.innerHTML = `
            <h3 class="text-2xl font-bold text-heading mb-6" data-i18n="tools">Herramientas</h3>
            <div id="tools-container" class="space-y-4"></div>
        `;
        document.getElementById('main-content').appendChild(section);
        const container = document.getElementById('tools-container');
        container.innerHTML = data.tools.map(cat => `
            <h4 class="text-lg font-bold">${cat.category}</h4>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${cat.items.map(item => `
                    <div class="flex items-center space-x-2 bg-card-light p-3 rounded-lg">
                        <i class="${item.icon} text-primary"></i>
                        <span>${item.name}</span>
                    </div>
                `).join('')}
            </div>
        `).join('');
    }

    renderContact(data) {
        const section = document.createElement('section');
        section.id = 'contact';
        section.className = 'card scroll-mt-24';
        section.innerHTML = `
            <h3 class="text-xl font-bold text-heading mb-6" data-i18n="contact">Contacto</h3>
            <form id="contact-form" class="space-y-4">
                <div>
                    <label for="name" class="block text-sm font-medium" data-i18n="name_field">Nombre</label>
                    <input type="text" id="name" name="name" required class="w-full">
                </div>
                <div>
                    <label for="email" class="block text-sm font-medium" data-i18n="email_field">Email</label>
                    <input type="email" id="email" name="email" required class="w-full">
                </div>
                <div>
                    <label for="message" class="block text-sm font-medium" data-i18n="message_field">Mensaje</label>
                    <textarea id="message" name="message" rows="4" required class="w-full"></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-full" data-i18n="send">Enviar</button>
            </form>
            <div id="form-success" class="message success" data-i18n="success">¡Enviado!</div>
            <div id="form-error" class="message error" data-i18n="error">Completa todos los campos.</div>
        `;
        document.getElementById('sidebar').appendChild(section);
    }

    bindEvents() {
        this.eventBus.on('theme:changed', () => this.i18n());
        this.eventBus.on('language:changed', () => this.i18n());

        document.getElementById('lang-toggle').addEventListener('click', () => {
            this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
            this.loadAndRender();
        });

        document.getElementById('export-pdf-btn').addEventListener('click', async () => {
            const { exportToPDF } = await import('../utils/export/pdf-exporter.js');
            const data = await this.dataLoader.load(this.currentLang);
            exportToPDF(data, this.currentLang);
        });

        document.getElementById('export-docx-btn').addEventListener('click', async () => {
            const { exportToDOCX } = await import('../utils/export/docx-exporter.js');
            const data = await this.dataLoader.load(this.currentLang);
            exportToDOCX(data, this.currentLang);
        });

        document.getElementById('toggle-experience').addEventListener('click', () => {
            this.expanded = !this.expanded;
            const btn = document.getElementById('toggle-experience').querySelector('span');
            btn.textContent = this.expanded ? 'Mostrar menos' : 'Mostrar más';
            this.renderExperienceItems(this.dataLoader.data.experience);
        });

        document.getElementById('contact-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const success = document.getElementById('form-success');
            const error = document.getElementById('form-error');
            if (name && email && message) {
                success.style.display = 'block';
                error.style.display = 'none';
                setTimeout(() => success.style.display = 'none', 5000);
                document.getElementById('contact-form').reset();
            } else {
                error.style.display = 'block';
                success.style.display = 'none';
            }
        });
    }

    i18n() {
        this.domUtils.translatePage(this.currentLang);
    }

    adjustPadding() {
        const header = document.querySelector('.header');
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
}

window.app = new App();