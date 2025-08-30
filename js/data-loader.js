export class DataLoader {
    async load(lang) {
        try {
            let response = await fetch(`data/lang/${lang}.json`);
            if (!response.ok) throw new Error();
            return await response.json();
        } catch (error) {
            console.warn(`Error loading ${lang}.json, trying fallback...`);
            try {
                const response = await fetch(`./data/lang/${lang}.json`);
                if (!response.ok && lang !== 'es') {
                    return this.load('es');
                }
                return await response.json();
            } catch {
                return this.getFallbackData(lang);
            }
        }
    }

    getFallbackData(lang) {
        console.warn('Using fallback data');
        return lang === 'es' ? this.esFallback() : this.enFallback();
    }

    esFallback() {
        return {
            about: { name: "José Carlos Castillo", title: "Ingeniero de Datos Senior", location: "CDMX", description: "Profesional en datos", email: "jose@email.com" },
            experience: [],
            projects: [],
            skills: ["SQL", "Python"],
            tools: []
        };
    }

    enFallback() {
        return {
            about: { name: "Jose Carlos Castillo", title: "Senior Data Engineer", location: "CDMX", description: "Data professional", email: "jose@email.com" },
            experience: [],
            projects: [],
            skills: ["SQL", "Python"],
            tools: []
        };
    }
}