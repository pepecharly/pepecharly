export class DataLoader {
    constructor() {
        this.cache = {};
    }
    
    async load(lang) {
        // Verificar si los datos están en caché
        if (this.cache[lang]) {
            return this.cache[lang];
        }
        
        try {
            // Intentar cargar desde la ruta normal
            let response = await this.safeFetch(`./data/lang/${lang}.json`);
            
            if (!response.ok) {
                // Intentar carga desde ruta alternativa (para GitHub Pages)
                response = await this.safeFetch(`/data/lang/${lang}.json`);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Almacenar en caché
            this.cache[lang] = data;
            
            return data;
            
        } catch (error) {
            console.error('Error loading language data:', error);
            
            // Fallback a español si el idioma solicitado falla
            if (lang !== 'es') {
                return this.load('es');
            }
            
            // Si incluso el español falla, lanzar error
            throw new Error('Could not load any language data');
        }
    }
    
    async safeFetch(path) {
        try {
            const response = await fetch(path);
            return response;
        } catch (error) {
            console.error(`Fetch error for path ${path}:`, error);
            return { ok: false };
        }
    }
    
    clearCache() {
        this.cache = {};
    }
}