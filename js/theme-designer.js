// Theme Designer JavaScript
class ThemeDesigner {
    constructor() {
        this.currentTheme = {};
        this.defaultTheme = {
            'primary-color': '#667eea',
            'secondary-color': '#764ba2',
            'success-color': '#48bb78',
            'danger-color': '#f56565',
            'warning-color': '#ed8936',
            'dark-bg': '#1a202c',
            'light-bg': '#2d3748',
            'text-primary': '#ffffff',
            'text-secondary': '#a0aec0',
            'border-color': '#4a5568',
            'input-bg': 'rgba(0, 0, 0, 0.3)',
            'input-bg-focus': 'rgba(0, 0, 0, 0.4)',
            'dropdown-bg': '#2d3748',
            'theme-name': 'Default Dark',
            'theme-author': 'Quiz App',
            'theme-description': 'Default dark theme with blue accent colors'
        };

        this.presets = {
            default: {
                'primary-color': '#667eea',
                'secondary-color': '#764ba2',
                'success-color': '#48bb78',
                'danger-color': '#f56565',
                'warning-color': '#ed8936',
                'dark-bg': '#1a202c',
                'light-bg': '#2d3748',
                'text-primary': '#ffffff',
                'text-secondary': '#a0aec0',
                'border-color': '#4a5568',
                'input-bg': 'rgba(0, 0, 0, 0.3)',
                'input-bg-focus': 'rgba(0, 0, 0, 0.4)',
                'dropdown-bg': '#2d3748',
                'theme-name': 'Default Dark',
                'theme-author': 'Quiz App',
                'theme-description': 'Default dark theme with blue accent colors'
            },
            light: {
                'primary-color': '#4299e1',
                'secondary-color': '#38b2ac',
                'success-color': '#48bb78',
                'danger-color': '#e53e3e',
                'warning-color': '#ed8936',
                'dark-bg': '#f7fafc',
                'light-bg': '#edf2f7',
                'text-primary': '#1a202c',
                'text-secondary': '#4a5568',
                'border-color': '#cbd5e0',
                'input-bg': 'rgba(255, 255, 255, 0.8)',
                'input-bg-focus': 'rgba(255, 255, 255, 0.9)',
                'dropdown-bg': '#ffffff',
                'theme-name': 'Light Theme',
                'theme-author': 'Quiz App',
                'theme-description': 'Clean light theme for better visibility'
            },
            ocean: {
                'primary-color': '#0ea5e9',
                'secondary-color': '#0891b2',
                'success-color': '#059669',
                'danger-color': '#dc2626',
                'warning-color': '#d97706',
                'dark-bg': '#0c4a6e',
                'light-bg': '#075985',
                'text-primary': '#e0f2fe',
                'text-secondary': '#7dd3fc',
                'border-color': '#0369a1',
                'input-bg': 'rgba(12, 74, 110, 0.4)',
                'input-bg-focus': 'rgba(12, 74, 110, 0.6)',
                'dropdown-bg': '#075985',
                'theme-name': 'Ocean Blue',
                'theme-author': 'Quiz App',
                'theme-description': 'Cool ocean-inspired blue theme'
            },
            forest: {
                'primary-color': '#059669',
                'secondary-color': '#047857',
                'success-color': '#10b981',
                'danger-color': '#dc2626',
                'warning-color': '#f59e0b',
                'dark-bg': '#064e3b',
                'light-bg': '#065f46',
                'text-primary': '#ecfdf5',
                'text-secondary': '#86efac',
                'border-color': '#047857',
                'input-bg': 'rgba(6, 78, 59, 0.4)',
                'input-bg-focus': 'rgba(6, 78, 59, 0.6)',
                'dropdown-bg': '#065f46',
                'theme-name': 'Forest Green',
                'theme-author': 'Quiz App',
                'theme-description': 'Nature-inspired green theme'
            },
            sunset: {
                'primary-color': '#f59e0b',
                'secondary-color': '#d97706',
                'success-color': '#10b981',
                'danger-color': '#dc2626',
                'warning-color': '#f59e0b',
                'dark-bg': '#7c2d12',
                'light-bg': '#9a3412',
                'text-primary': '#fed7aa',
                'text-secondary': '#fdba74',
                'border-color': '#ea580c',
                'input-bg': 'rgba(124, 45, 18, 0.4)',
                'input-bg-focus': 'rgba(124, 45, 18, 0.6)',
                'dropdown-bg': '#9a3412',
                'theme-name': 'Sunset Orange',
                'theme-author': 'Quiz App',
                'theme-description': 'Warm sunset-inspired orange theme'
            },
            midnight: {
                'primary-color': '#8b5cf6',
                'secondary-color': '#7c3aed',
                'success-color': '#10b981',
                'danger-color': '#f87171',
                'warning-color': '#fbbf24',
                'dark-bg': '#1e1b4b',
                'light-bg': '#312e81',
                'text-primary': '#e0e7ff',
                'text-secondary': '#a5b4fc',
                'border-color': '#4338ca',
                'input-bg': 'rgba(30, 27, 75, 0.4)',
                'input-bg-focus': 'rgba(30, 27, 75, 0.6)',
                'dropdown-bg': '#312e81',
                'theme-name': 'Midnight Purple',
                'theme-author': 'Quiz App',
                'theme-description': 'Deep midnight theme with purple accents'
            }
        };

        this.init();
    }

    init() {
        this.loadCurrentTheme();
        this.bindEvents();
        this.updatePreview();
        this.generateCSS();
    }

    loadCurrentTheme() {
        // Try to load from localStorage first
        const savedTheme = localStorage.getItem('customTheme');
        if (savedTheme) {
            try {
                this.currentTheme = JSON.parse(savedTheme);
            } catch (e) {
                console.warn('Failed to parse saved theme, using default');
                this.currentTheme = { ...this.defaultTheme };
            }
        } else {
            this.currentTheme = { ...this.defaultTheme };
        }

        // Update form fields with current theme
        this.updateFormFields();
    }

    updateFormFields() {
        Object.keys(this.currentTheme).forEach(key => {
            const element = document.getElementById(key);
            const textElement = document.getElementById(key + '-text');
            
            if (element) {
                if (element.type === 'color') {
                    element.value = this.currentTheme[key];
                } else {
                    element.value = this.currentTheme[key] || '';
                }
            }
            
            if (textElement) {
                textElement.value = this.currentTheme[key] || '';
            }
        });
    }

    bindEvents() {
        // Color picker events
        document.querySelectorAll('.color-picker').forEach(picker => {
            picker.addEventListener('input', (e) => {
                const key = e.target.id;
                const textInput = document.getElementById(key + '-text');
                this.currentTheme[key] = e.target.value;
                if (textInput) textInput.value = e.target.value;
                this.updatePreview();
                this.generateCSS();
                this.saveToLocalStorage();
            });
        });

        // Color text input events
        document.querySelectorAll('.color-text').forEach(input => {
            input.addEventListener('input', (e) => {
                const key = e.target.id.replace('-text', '');
                const colorPicker = document.getElementById(key);
                
                if (this.isValidColor(e.target.value)) {
                    this.currentTheme[key] = e.target.value;
                    if (colorPicker) colorPicker.value = e.target.value;
                    this.updatePreview();
                    this.generateCSS();
                    this.saveToLocalStorage();
                }
            });
        });

        // Theme info events
        ['theme-name', 'theme-author', 'theme-description'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.currentTheme[id] = e.target.value;
                    this.generateCSS();
                    this.saveToLocalStorage();
                });
            }
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
                
                // Update active preset button
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });

        // Action buttons
        document.getElementById('reset-theme').addEventListener('click', () => {
            this.resetToDefault();
        });

        document.getElementById('save-theme').addEventListener('click', () => {
            this.saveThemeFile();
        });

        document.getElementById('load-theme').addEventListener('change', (e) => {
            this.loadThemeFile(e.target.files[0]);
        });
    }

    isValidColor(color) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    }

    applyPreset(presetName) {
        if (this.presets[presetName]) {
            this.currentTheme = { ...this.presets[presetName] };
            this.updateFormFields();
            this.updatePreview();
            this.generateCSS();
            this.saveToLocalStorage();
        }
    }

    updatePreview() {
        // Update CSS custom properties
        const root = document.documentElement;
        Object.keys(this.currentTheme).forEach(key => {
            if (key.startsWith('theme-')) return; // Skip metadata
            root.style.setProperty(`--${key}`, this.currentTheme[key]);
        });
    }

    generateCSS() {
        const metadata = `/* Theme Variables - ${this.currentTheme['theme-name'] || 'Custom Theme'} */
/* Author: ${this.currentTheme['theme-author'] || 'Unknown'} */
/* Description: ${this.currentTheme['theme-description'] || 'Custom theme'} */`;

        const variables = Object.keys(this.currentTheme)
            .filter(key => !key.startsWith('theme-'))
            .map(key => `    --${key}: ${this.currentTheme[key]};`)
            .join('\n');

        const additionalStyles = `
/* Additional theme-specific styling that can be customized */
body {
    background: linear-gradient(135deg, var(--dark-bg) 0%, var(--light-bg) 100%);
}

/* Branding header specific styling for better contrast */
.branding-header {
    background: var(--light-bg);
    backdrop-filter: blur(15px);
    box-shadow: 0 2px 10px var(--border-color);
}

/* Optional: Theme-specific animation and gradient overrides */
.main-title {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.topic-name,
.round-title,
.complete-title,
.thank-you-title {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    box-shadow: 0 4px 15px var(--border-color);
}

.btn-primary:hover:not(:disabled) {
    box-shadow: 0 6px 20px var(--primary-color);
}

.upload-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    box-shadow: 0 4px 15px var(--border-color);
}

.upload-btn:hover {
    box-shadow: 0 6px 20px var(--primary-color);
}

/* Gradient for stats display */
.stat-number {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.topic-number {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

.question-number {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
}

/* Thank you screen gradient */
.thank-you-title {
    background: linear-gradient(135deg, var(--success-color), var(--primary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* Tool card hover effects */
.tool-card:hover {
    box-shadow: 0 4px 20px var(--border-color);
}
`;

        const fullCSS = `${metadata}
:root {
${variables}
    
    /* Theme Metadata (for theme manager) */
    --theme-name: "${this.currentTheme['theme-name'] || 'Custom Theme'}";
    --theme-author: "${this.currentTheme['theme-author'] || 'Unknown'}";
    --theme-version: "1.0.0";
    --theme-description: "${this.currentTheme['theme-description'] || 'Custom theme'}";
}
${additionalStyles}`;

        document.getElementById('css-preview').textContent = fullCSS;
    }

    resetToDefault() {
        if (confirm('Opravdu chcete obnovit výchozí téma? Všechny změny budou ztraceny.')) {
            this.currentTheme = { ...this.defaultTheme };
            this.updateFormFields();
            this.updatePreview();
            this.generateCSS();
            this.saveToLocalStorage();
            
            // Reset active preset button
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('[data-preset="default"]').classList.add('active');
        }
    }

    saveThemeFile() {
        const css = document.getElementById('css-preview').textContent;
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(this.currentTheme['theme-name'] || 'custom-theme').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Theme saved as CSS file');
    }

    loadThemeFile(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const css = e.target.result;
            this.parseThemeFromCSS(css);
        };
        reader.readAsText(file);
    }

    parseThemeFromCSS(css) {
        try {
            // Extract CSS variables from the file
            const variableRegex = /--([^:]+):\s*([^;]+);/g;
            let match;
            const newTheme = {};
            
            while ((match = variableRegex.exec(css)) !== null) {
                const [, name, value] = match;
                const cleanName = name.trim();
                const cleanValue = value.trim().replace(/['"]/g, '');
                
                // Only include variables we support
                if (this.defaultTheme.hasOwnProperty(cleanName)) {
                    newTheme[cleanName] = cleanValue;
                }
            }
            
            // If we found valid theme variables, apply them
            if (Object.keys(newTheme).length > 0) {
                this.currentTheme = { ...this.defaultTheme, ...newTheme };
                this.updateFormFields();
                this.updatePreview();
                this.generateCSS();
                this.saveToLocalStorage();
                
                alert('Téma bylo úspěšně načteno!');
                
                // Reset active preset button
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            } else {
                alert('Nepodařilo se načíst téma. Soubor neobsahuje platné proměnné tématu.');
            }
        } catch (error) {
            console.error('Error parsing theme CSS:', error);
            alert('Chyba při načítání tématu. Zkontrolujte formát souboru.');
        }
    }

    saveToLocalStorage() {
        try {
            localStorage.setItem('customTheme', JSON.stringify(this.currentTheme));
        } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
        }
    }

    // Export theme for use in other applications
    exportThemeJSON() {
        const themeData = {
            ...this.currentTheme,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(this.currentTheme['theme-name'] || 'custom-theme').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize theme designer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeDesigner = new ThemeDesigner();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    window.themeDesigner.saveThemeFile();
                    break;
                case 'r':
                    e.preventDefault();
                    window.themeDesigner.resetToDefault();
                    break;
            }
        }
    });
    
    console.log('Theme Designer initialized');
    console.log('Keyboard shortcuts:');
    console.log('  Ctrl+S: Save theme');
    console.log('  Ctrl+R: Reset to default');
}); 