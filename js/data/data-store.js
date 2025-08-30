export class DataStore {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.data = null;
    }
    
    setData(data) {
        this.data = data;
        this.eventBus.emit('data:updated', { data: this.data });
    }
    
    getData() {
        return this.data;
    }
    
    getSectionData(section) {
        if (!this.data || !this.data[section]) {
            return null;
        }
        return this.data[section];
    }
    
    updateSectionData(section, data) {
        if (!this.data) {
            this.data = {};
        }
        
        this.data[section] = data;
        this.eventBus.emit('data:updated', { data: this.data });
        this.eventBus.emit('data:sectionUpdated', { 
            section: section, 
            data: data 
        });
    }
}