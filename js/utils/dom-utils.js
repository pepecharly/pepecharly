export class DOMUtils {
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    translatePage(lang) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translations = {
                es: { name: "José Carlos", contact_me: "Contáctame", download_pdf: "Descargar PDF", ... },
                en: { name: "Jose Carlos", contact_me: "Contact Me", download_pdf: "Download PDF", ... }
            };
            if (translations[lang][key]) {
                el.textContent = translations[lang][key];
            }
        });
    }
}