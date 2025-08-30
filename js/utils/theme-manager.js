export class ThemeManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.themes = ['classic', 'dark', 'linkedin', 'neumorphism', 'darkpunk', 'neon'];
    }

    setTheme(themeId) {
        if (!this.themes.includes(themeId)) return;
        document.documentElement.setAttribute('data-theme', themeId);
        document.getElementById('theme-stylesheet').href = `css/themes/${themeId}/theme.css`;
        localStorage.setItem('theme', themeId);
        this.eventBus.emit('theme:changed', { theme: themeId });
    }

    applySavedTheme() {
        const saved = localStorage.getItem('theme');
        const theme = this.themes.includes(saved) ? saved : 'classic';
        this.setTheme(theme);
    }
}
