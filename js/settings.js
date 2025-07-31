// Settings Management for Quiz Application
class SettingsManager {
    constructor() {
        this.config = null;
        this.originalConfig = null;
        this.currentSection = 'all';
        this.searchTerm = '';
        this.init();
    }

    async init() {
        // Load configuration
        await this.loadConfig();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Initial render
        this.renderConfigFields();
        this.updatePreview();
    }

    async loadConfig() {
        try {
            await window.configLoader.loadConfig();
            this.config = JSON.parse(JSON.stringify(window.configLoader.config));
            this.originalConfig = JSON.parse(JSON.stringify(window.configLoader.config));
        } catch (error) {
            this.showMessage('Chyba při načítání konfigurace: ' + error.message, 'error');
        }
    }

    setupEventListeners() {
        // Section selector
        document.getElementById('sectionSelect').addEventListener('change', (e) => {
            this.currentSection = e.target.value;
            this.renderConfigFields();
        });

        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.filterFields();
        });

        // Action buttons
        document.getElementById('saveBtn').addEventListener('click', () => this.saveConfig());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetConfig());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportConfig());
        document.getElementById('importBtn').addEventListener('click', () => this.importConfig());
        document.getElementById('backBtn').addEventListener('click', () => this.goBack());

        // Import file handler
        document.getElementById('importFile').addEventListener('change', (e) => this.handleFileImport(e));

        // Listen for form changes to update preview
        document.getElementById('configForm').addEventListener('input', () => {
            this.updateConfigFromForm();
            this.updatePreview();
        });

        document.getElementById('configForm').addEventListener('change', () => {
            this.updateConfigFromForm();
            this.updatePreview();
        });
    }

    renderConfigFields() {
        const container = document.getElementById('configFields');
        container.innerHTML = '';

        if (this.currentSection === 'all') {
            this.renderAllSections(container);
        } else {
            this.renderSection(container, this.currentSection, this.config[this.currentSection]);
        }

        this.filterFields();
    }

    renderAllSections(container) {
        const sections = Object.keys(this.config);
        sections.forEach(sectionKey => {
            this.renderSection(container, sectionKey, this.config[sectionKey]);
        });
    }

    renderSection(container, sectionKey, sectionData) {
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'field-group';
        sectionDiv.dataset.section = sectionKey;

        const sectionTitle = this.createSectionTitle(sectionKey);
        sectionDiv.appendChild(sectionTitle);

        this.renderObject(sectionDiv, sectionData, sectionKey);
        container.appendChild(sectionDiv);
    }

    createSectionTitle(sectionKey) {
        const title = document.createElement('h3');
        title.className = 'section-title';
        
        const icons = {
            app: '📱',
            branding: '🎨',
            ui: '🖥️',
            messages: '💬',
            builders: '🔧',
            sample: '📝'
        };

        title.innerHTML = `${icons[sectionKey] || '⚙️'} ${this.humanizeKey(sectionKey)}`;
        return title;
    }

    renderObject(container, obj, path = '') {
        Object.keys(obj).forEach(key => {
            const value = obj[key];
            const fieldPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Nested object
                const nestedDiv = document.createElement('div');
                nestedDiv.className = 'nested-object';
                nestedDiv.style.marginLeft = '20px';
                nestedDiv.style.borderLeft = '3px solid var(--primary-color)';
                nestedDiv.style.paddingLeft = '15px';
                nestedDiv.style.marginTop = '10px';

                const nestedTitle = document.createElement('h4');
                nestedTitle.style.color = 'var(--primary-color)';
                nestedTitle.style.marginBottom = '10px';
                nestedTitle.textContent = this.humanizeKey(key);
                nestedDiv.appendChild(nestedTitle);

                this.renderObject(nestedDiv, value, fieldPath);
                container.appendChild(nestedDiv);
            } else {
                // Regular field
                const fieldItem = this.createFieldItem(key, value, fieldPath);
                container.appendChild(fieldItem);
            }
        });
    }

    createFieldItem(key, value, path) {
        const fieldItem = document.createElement('div');
        fieldItem.className = 'field-item';
        fieldItem.dataset.path = path;
        fieldItem.dataset.searchText = `${key} ${path} ${value}`.toLowerCase();

        // Field path display
        const pathDisplay = document.createElement('div');
        pathDisplay.className = 'field-path';
        pathDisplay.textContent = path;
        fieldItem.appendChild(pathDisplay);

        // Field label
        const label = document.createElement('label');
        label.className = 'field-label';
        label.textContent = this.humanizeKey(key);
        fieldItem.appendChild(label);

        // Field input
        const input = this.createInput(value, path);
        fieldItem.appendChild(input);

        return fieldItem;
    }

    createInput(value, path) {
        if (typeof value === 'boolean') {
            return this.createCheckboxInput(value, path);
        } else if (Array.isArray(value)) {
            return this.createArrayInput(value, path);
        } else if (typeof value === 'number') {
            return this.createNumberInput(value, path);
        } else if (typeof value === 'string' && value.length > 50) {
            return this.createTextareaInput(value, path);
        } else {
            return this.createTextInput(value, path);
        }
    }

    createTextInput(value, path) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'field-input';
        input.value = value;
        input.dataset.path = path;
        return input;
    }

    createTextareaInput(value, path) {
        const textarea = document.createElement('textarea');
        textarea.className = 'field-input textarea';
        textarea.value = value;
        textarea.dataset.path = path;
        return textarea;
    }

    createNumberInput(value, path) {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'field-input';
        input.value = value;
        input.dataset.path = path;
        return input;
    }

    createCheckboxInput(value, path) {
        const wrapper = document.createElement('div');
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'field-input';
        input.checked = value;
        input.dataset.path = path;
        
        const label = document.createElement('label');
        label.textContent = value ? 'Zapnuto' : 'Vypnuto';
        label.style.marginLeft = '8px';
        
        input.addEventListener('change', () => {
            label.textContent = input.checked ? 'Zapnuto' : 'Vypnuto';
        });
        
        wrapper.appendChild(input);
        wrapper.appendChild(label);
        return wrapper;
    }

    createArrayInput(value, path) {
        const wrapper = document.createElement('div');
        wrapper.className = 'array-input-wrapper';

        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'array-items';

        // Render existing items
        value.forEach((item, index) => {
            const itemDiv = this.createArrayItemInput(item, `${path}[${index}]`);
            itemsContainer.appendChild(itemDiv);
        });

        // Add new item button
        const addButton = document.createElement('button');
        addButton.type = 'button';
        addButton.className = 'add-array-item';
        addButton.textContent = '+ Přidat položku';
        addButton.addEventListener('click', () => {
            const newIndex = itemsContainer.children.length;
            const newItem = this.createArrayItemInput('', `${path}[${newIndex}]`);
            itemsContainer.appendChild(newItem);
        });

        wrapper.appendChild(itemsContainer);
        wrapper.appendChild(addButton);
        return wrapper;
    }

    createArrayItemInput(value, path) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'array-item';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'field-input';
        input.value = value;
        input.dataset.path = path;

        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = '✕';
        removeButton.addEventListener('click', () => {
            itemDiv.remove();
            this.updateConfigFromForm();
            this.updatePreview();
        });

        itemDiv.appendChild(input);
        itemDiv.appendChild(removeButton);
        return itemDiv;
    }

    filterFields() {
        const fieldItems = document.querySelectorAll('.field-item');
        const fieldGroups = document.querySelectorAll('.field-group');

        if (!this.searchTerm) {
            fieldItems.forEach(item => item.style.display = '');
            fieldGroups.forEach(group => group.classList.remove('hidden'));
            return;
        }

        fieldItems.forEach(item => {
            const searchText = item.dataset.searchText || '';
            if (searchText.includes(this.searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });

        // Hide empty sections
        fieldGroups.forEach(group => {
            const visibleItems = group.querySelectorAll('.field-item:not([style*="display: none"])');
            if (visibleItems.length === 0) {
                group.classList.add('hidden');
            } else {
                group.classList.remove('hidden');
            }
        });
    }

    updateConfigFromForm() {
        const inputs = document.querySelectorAll('.field-input[data-path]');
        
        inputs.forEach(input => {
            const path = input.dataset.path;
            let value;

            if (input.type === 'checkbox') {
                value = input.checked;
            } else if (input.type === 'number') {
                value = parseFloat(input.value) || 0;
            } else {
                value = input.value;
            }

            this.setNestedValue(this.config, path, value);
        });

        // Handle arrays separately
        this.updateArraysFromForm();
    }

    updateArraysFromForm() {
        const arrayWrappers = document.querySelectorAll('.array-input-wrapper');
        
        arrayWrappers.forEach(wrapper => {
            const arrayInputs = wrapper.querySelectorAll('.array-item input');
            const path = arrayInputs[0]?.dataset.path;
            
            if (path) {
                const basePath = path.replace(/\[\d+\]$/, '');
                const values = Array.from(arrayInputs).map(input => input.value).filter(v => v !== '');
                this.setNestedValue(this.config, basePath, values);
            }
        });
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current)) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    updatePreview() {
        const preview = document.getElementById('configPreview');
        preview.value = JSON.stringify(this.config, null, 2);
    }

    saveConfig() {
        try {
            // Update the global config
            window.configLoader.config = JSON.parse(JSON.stringify(this.config));
            
            // Generate new config file content
            const configContent = this.generateConfigFileContent();
            
            // Download the new config file
            this.downloadFile('config-loader.js', configContent);
            
            this.showMessage('Konfigurace byla úspěšně uložena! Stáhněte nový soubor config-loader.js a nahraďte jím stávající.', 'success');
        } catch (error) {
            this.showMessage('Chyba při ukládání konfigurace: ' + error.message, 'error');
        }
    }

    generateConfigFileContent() {
        const template = `// Configuration Loader for Quiz Application
// Configuration is embedded directly to work with file:// protocol

// CONFIGURATION DATA - Edit this object to customize your quiz
const EMBEDDED_CONFIG = ${JSON.stringify(this.config, null, 2)};

class ConfigLoader {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    async loadConfig() {
        if (this.loaded) return this.config;
        
        // Use embedded configuration directly
        this.config = EMBEDDED_CONFIG;
        this.loaded = true;
        
        // Apply configuration to the page immediately
        this.applyPageConfig();
        
        return this.config;
    }

    applyPageConfig() {
        if (!this.config) return;

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = this.config.app.title;
        }

        // Update main title and subtitle if they exist
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) {
            let titleText = this.config.app.name;
            if (this.config.app.organizer) {
                titleText += \` - \${this.config.app.organizer}\`;
            }
            mainTitle.textContent = titleText;
        }

        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = this.config.app.subtitle;
        }

        // Update all elements with data-config attributes
        this.updateConfigElements();
    }

    updateConfigElements() {
        const configElements = document.querySelectorAll('[data-config]');
        configElements.forEach(element => {
            const configPath = element.getAttribute('data-config');
            const configValue = this.get(configPath);
            if (configValue) {
                element.textContent = configValue;
            }
        });
    }

    get(path, fallback = '') {
        if (!this.config) return fallback;
        
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return fallback;
            }
        }
        
        return current;
    }

    getMessage(category, key, replacements = {}) {
        const message = this.get(\`messages.\${category}.\${key}\`, key);
        
        // Replace placeholders in the message
        let result = message;
        for (const [placeholder, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(\`\\\\{\${placeholder}\\\\}\`, 'g'), value);
        }
        
        return result;
    }

    getRoundName(roundNumber) {
        const rounds = this.get('ui.rounds', []);
        const fallback = this.get('ui.roundFallback', 'Kolo');
        
        if (roundNumber <= rounds.length) {
            return rounds[roundNumber - 1];
        } else {
            return \`\${fallback} \${roundNumber}\`;
        }
    }

    getDefaultConfig() {
        // Return the embedded configuration as default
        return EMBEDDED_CONFIG;
    }
}

// Create global instance
window.configLoader = new ConfigLoader();

// Auto-load configuration when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await window.configLoader.loadConfig();
}); `;

        return template;
    }

    resetConfig() {
        if (confirm('Opravdu chcete obnovit původní konfiguraci? Všechny změny budou ztraceny.')) {
            this.config = JSON.parse(JSON.stringify(this.originalConfig));
            this.renderConfigFields();
            this.updatePreview();
            this.showMessage('Konfigurace byla obnovena na původní hodnoty.', 'info');
        }
    }

    exportConfig() {
        const configJson = JSON.stringify(this.config, null, 2);
        this.downloadFile('quiz-config.json', configJson);
        this.showMessage('Konfigurace byla exportována!', 'success');
    }

    importConfig() {
        document.getElementById('importFile').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedConfig = JSON.parse(e.target.result);
                this.config = importedConfig;
                this.renderConfigFields();
                this.updatePreview();
                this.showMessage('Konfigurace byla úspěšně importována!', 'success');
            } catch (error) {
                this.showMessage('Chyba při importu: Neplatný JSON soubor.', 'error');
            }
        };
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    goBack() {
        window.location.href = '../index.html';
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.getElementById('statusMessage');
        messageDiv.textContent = text;
        messageDiv.className = `status-message ${type}`;
        messageDiv.classList.add('show');

        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }

    humanizeKey(key) {
        const translations = {
            // App section
            app: 'Aplikace',
            name: 'Název',
            subtitle: 'Podtitul',
            title: 'Titulek',
            organizer: 'Organizátor',
            
            // Branding section
            branding: 'Branding',
            enabled: 'Povoleno',
            logoUrl: 'URL loga',
            organizationName: 'Název organizace',
            website: 'Webová stránka',
            textColor: 'Barva textu',
            
            // UI section
            ui: 'Uživatelské rozhraní',
            landing: 'Úvodní stránka',
            quizSetup: 'Nastavení kvízu',
            quiz: 'Kvíz',
            screens: 'Obrazovky',
            rounds: 'Kola',
            roundFallback: 'Náhradní text kola',
            
            // Messages section
            messages: 'Zprávy',
            success: 'Úspěch',
            error: 'Chyba',
            validation: 'Validace',
            
            // Builders section
            builders: 'Nástroje',
            topicBuilder: 'Tvořič témat',
            quizBuilder: 'Stavitel kvízů',
            
            // Sample section
            sample: 'Vzorky',
            questionTemplate: 'Šablona otázky',
            answerTemplate: 'Šablona odpovědi',
            explanationTemplate: 'Šablona vysvětlení',
            sourceTemplate: 'Šablona zdroje',
            imageQuestion: 'Otázka s obrázkem',
            audioQuestion: 'Otázka se zvukem',
            themes: 'Témata'
        };

        return translations[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }
}

// Initialize settings manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
}); 