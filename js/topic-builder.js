// Topic Builder JavaScript

class TopicBuilder {
    constructor() {
        this.questions = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderEmptyState();
        this.updatePreview();
    }

    bindEvents() {
        // Add question button
        document.getElementById('add-question-btn').addEventListener('click', () => {
            this.addQuestion();
        });

        // Theme name input
        document.getElementById('theme-name').addEventListener('input', () => {
            this.updatePreview();
            this.updateDownloadButton();
        });

        // Download button
        document.getElementById('download-btn').addEventListener('click', () => {
            this.downloadJSON();
        });

        // Load button
        document.getElementById('load-btn').addEventListener('click', () => {
            document.getElementById('json-file-input').click();
        });

        // Load from clipboard button
        document.getElementById('load-clipboard-btn').addEventListener('click', () => {
            this.loadFromClipboard();
        });

        // File input
        document.getElementById('json-file-input').addEventListener('change', (e) => {
            this.loadJSON(e.target.files[0]);
        });

        // Clear button
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAll();
        });
    }

    addQuestion() {
        const questionNumber = this.questions.length + 1;
        const questionData = {
            question: '',
            answer: '',
            explanation: '',
            source: '',
            difficulty: 'střední',
            image: '',
            audio: ''
        };

        this.questions.push(questionData);
        this.renderQuestions();
        this.updatePreview();
        this.updateDownloadButton();

        // Scroll to the new question
        setTimeout(() => {
            const newQuestion = document.querySelector('.question-item:last-child');
            if (newQuestion) {
                newQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                newQuestion.querySelector('.form-input').focus();
            }
        }, 100);
    }

    removeQuestion(index) {
        this.questions.splice(index, 1);
        this.renderQuestions();
        this.updatePreview();
        this.updateDownloadButton();
    }

    updateQuestion(index, field, value) {
        if (this.questions[index]) {
            // Normalize file paths for media fields
            if ((field === 'image' || field === 'audio') && value) {
                value = this.normalizeFilePath(value);
            }
            
            this.questions[index][field] = value;
            this.updatePreview();
            this.updateDownloadButton();
            
            // Update media preview if it's a media field
            if (field === 'image' || field === 'audio') {
                this.updateMediaPreview(index, field, value);
            }
        }
    }

    normalizeFilePath(path) {
        if (!path) return path;
        
        // Convert Windows-style backslashes to forward slashes
        let normalizedPath = path.replace(/\\/g, '/');
        
        // Fix common Windows path patterns
        if (normalizedPath.startsWith('./')) {
            // Already correct relative path
            return normalizedPath;
        } else if (normalizedPath.startsWith('.\\')) {
            // Convert .\path to ./path
            return normalizedPath.replace('.\\', './');
        } else if (normalizedPath.match(/^[A-Za-z]:/)) {
            // Convert absolute Windows path to file:// URL
            return 'file:///' + normalizedPath;
        } else if (!normalizedPath.startsWith('http') && !normalizedPath.startsWith('file://') && !normalizedPath.startsWith('./')) {
            // If it's just a filename, assume it's in the same directory
            return './' + normalizedPath;
        }
        
        return normalizedPath;
    }

    selectImageFile(index) {
        document.getElementById(`image-file-${index}`).click();
    }

    selectAudioFile(index) {
        document.getElementById(`audio-file-${index}`).click();
    }

    handleImageFileSelect(index, input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Get the file name for reference
            const fileName = file.name;
            
            // Create different path suggestions based on common scenarios
            const suggestions = [
                `../images/${fileName}`, // Most common: images subdirectory
                `../media/${fileName}`, // Alternative: media subdirectory
                `file:///${fileName}`, // If file is in same directory as quiz
                `file:///C:/Users/YourName/Desktop/quiz/images/${fileName}`, // Windows absolute path example
                `file:///Users/YourName/Desktop/quiz/images/${fileName}` // Mac absolute path example
            ];
            
            // Update the URL input with the most common suggestion
            const urlInput = input.closest('.form-group').querySelector('.media-url-input');
            urlInput.value = suggestions[0];
            
            // Update the question data
            this.updateQuestion(index, 'image', suggestions[0]);
            
            // Create a preview using a blob URL for immediate preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateMediaPreview(index, 'image', e.target.result, true);
            };
            reader.readAsDataURL(file);
            
            // Show detailed guidance message
            const message = `📷 Soubor "${fileName}" byl vybrán.\n\nNavrhovaná cesta: ${suggestions[0]}\n\nPro správné fungování:\n1. Umístěte soubor do složky ../images/ (doporučeno)\n2. Nebo upravte cestu v poli výše\n\nMožné cesty:\n• ../images/${fileName} (doporučeno)\n• ../media/${fileName} (alternativa)\n• file:///${fileName} (stejná složka)\n\n⚠️ Používejte lomítka (/), ne zpětná lomítka (\\)`;
            
            this.showDetailedMessage(message, 'info');
        }
    }

    handleAudioFileSelect(index, input) {
        if (input.files && input.files[0]) {
            const file = input.files[0];
            
            // Get the file name for reference
            const fileName = file.name;
            
            // Create different path suggestions based on common scenarios
            const suggestions = [
                `../audio/${fileName}`, // Most common: audio subdirectory
                `../media/${fileName}`, // Alternative: media subdirectory
                `file:///${fileName}`, // If file is in same directory as quiz
                `file:///C:/Users/YourName/Desktop/quiz/audio/${fileName}`, // Windows absolute path example
                `file:///Users/YourName/Desktop/quiz/audio/${fileName}` // Mac absolute path example
            ];
            
            // Update the URL input with the most common suggestion
            const urlInput = input.closest('.form-group').querySelector('.media-url-input');
            urlInput.value = suggestions[0];
            
            // Update the question data
            this.updateQuestion(index, 'audio', suggestions[0]);
            
            // Create a preview using a blob URL for immediate preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateMediaPreview(index, 'audio', e.target.result, true);
            };
            reader.readAsDataURL(file);
            
            // Show detailed guidance message
            const message = `🔊 Soubor "${fileName}" byl vybrán.\n\nNavrhovaná cesta: ${suggestions[0]}\n\nPro správné fungování:\n1. Umístěte soubor do složky ../audio/ (doporučeno)\n2. Nebo upravte cestu v poli výše\n\nMožné cesty:\n• ../audio/${fileName} (doporučeno)\n• ../media/${fileName} (alternativa)\n• file:///${fileName} (stejná složka)\n\n⚠️ Používejte lomítka (/), ne zpětná lomítka (\\)`;
            
            this.showDetailedMessage(message, 'info');
        }
    }

    updateMediaPreview(index, type, source, isLocalFile = false) {
        const previewContainer = document.getElementById(`${type}-preview-${index}`);
        const parentGroup = document.querySelector(`#${type}-file-${index}`).closest('.form-group');
        
        if (!source) {
            // Remove preview if no source
            if (previewContainer) {
                previewContainer.remove();
            }
            return;
        }

        // Create or update preview container
        let preview = previewContainer;
        if (!preview) {
            preview = document.createElement('div');
            preview.className = 'media-preview';
            preview.id = `${type}-preview-${index}`;
            parentGroup.appendChild(preview);
        }

        if (type === 'image') {
            preview.innerHTML = `
                <img src="${source}" alt="Náhled obrázku" style="max-width: 200px; max-height: 150px; object-fit: contain; border-radius: 4px; margin-top: 0.5rem;" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <div style="display: none; color: var(--danger-color, #f56565); font-size: 0.9rem; margin-top: 0.5rem;">
                    ${isLocalFile ? 'Náhled lokálního souboru' : 'Chyba načítání obrázku'}
                </div>
                ${isLocalFile ? '<small style="color: var(--text-secondary); font-size: 0.8rem; display: block; margin-top: 0.25rem;">Náhled lokálního souboru</small>' : ''}
            `;
        } else if (type === 'audio') {
            preview.innerHTML = `
                <audio controls style="width: 100%; max-width: 300px; margin-top: 0.5rem;">
                    <source src="${source}">
                    Váš prohlížeč nepodporuje přehrávání zvuku.
                </audio>
                ${isLocalFile ? '<small style="color: var(--text-secondary); font-size: 0.8rem; display: block; margin-top: 0.25rem;">Náhled lokálního souboru</small>' : ''}
            `;
        }
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        
        if (this.questions.length === 0) {
            this.renderEmptyState();
            return;
        }

        container.innerHTML = '';

        this.questions.forEach((question, index) => {
            const questionElement = this.createQuestionElement(question, index);
            container.appendChild(questionElement);
            
            // Update media previews after the element is added to DOM
            if (question.image) {
                this.updateMediaPreview(index, 'image', question.image);
            }
            if (question.audio) {
                this.updateMediaPreview(index, 'audio', question.audio);
            }
        });
    }

    createQuestionElement(questionData, index) {
        const div = document.createElement('div');
        div.className = 'question-item';
        
        div.innerHTML = `
            <div class="question-header">
                <span class="question-number">Otázka ${index + 1}</span>
                <button class="remove-question-btn" onclick="topicBuilder.removeQuestion(${index})">
                    🗑️ Odstranit
                </button>
            </div>

            <div class="form-group">
                <label class="form-label">Otázka:</label>
                <textarea class="form-textarea" placeholder="Zadejte text otázky..."
                    onchange="topicBuilder.updateQuestion(${index}, 'question', this.value)">${questionData.question}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Správná odpověď:</label>
                <input type="text" class="form-input" placeholder="Zadejte správnou odpověď..."
                    value="${questionData.answer}"
                    onchange="topicBuilder.updateQuestion(${index}, 'answer', this.value)">
            </div>

            <div class="form-group">
                <label class="form-label">Vysvětlení:</label>
                <textarea class="form-textarea" placeholder="Zadejte podrobné vysvětlení správné odpovědi..."
                    onchange="topicBuilder.updateQuestion(${index}, 'explanation', this.value)">${questionData.explanation}</textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Zdroj:</label>
                <input type="text" class="form-input" placeholder="Zadejte zdroj informace..."
                    value="${questionData.source}"
                    onchange="topicBuilder.updateQuestion(${index}, 'source', this.value)">
            </div>

            <div class="form-group">
                <label class="form-label">Obtížnost:</label>
                <select class="form-select" onchange="topicBuilder.updateQuestion(${index}, 'difficulty', this.value)">
                    <option value="velmi lehká" ${questionData.difficulty === 'velmi lehká' ? 'selected' : ''}>Velmi lehká</option>
                    <option value="střední" ${questionData.difficulty === 'střední' ? 'selected' : ''}>Střední</option>
                    <option value="velmi těžká" ${questionData.difficulty === 'velmi těžká' ? 'selected' : ''}>Velmi těžká</option>
                </select>
                <div class="difficulty-preview ${questionData.difficulty.replace(/\s+/g, '-').replace(/ě/g, 'e').replace(/í/g, 'i').replace(/á/g, 'a').replace(/ž/g, 'z')}">
                    ${questionData.difficulty}
                </div>
            </div>

            <div class="media-section">
                <h4 class="media-section-title">📷 Média (volitelné)</h4>
                
                <div class="form-group">
                    <label class="form-label">Obrázek:</label>
                    <div class="media-input-group">
                        <input type="url" class="form-input media-url-input" placeholder="https://example.com/image.jpg nebo cesta k lokálnímu souboru"
                            value="${questionData.image || ''}"
                            onchange="topicBuilder.updateQuestion(${index}, 'image', this.value)">
                        <button type="button" class="media-file-btn" onclick="topicBuilder.selectImageFile(${index})">
                            📁 Vybrat soubor
                        </button>
                    </div>
                    <input type="file" class="media-file-input" id="image-file-${index}" accept="image/*" style="display: none;" 
                           onchange="topicBuilder.handleImageFileSelect(${index}, this)">
                    <small class="form-help">Zadejte URL obrázku nebo vyberte lokální soubor. Pro lokální soubory použijte formát: file:///cesta/k/souboru nebo ./soubor.jpg (pokud je ve stejné složce).</small>
                    ${questionData.image ? `<div class="media-preview" id="image-preview-${index}">
                        <img src="${questionData.image}" alt="Náhled obrázku" style="max-width: 200px; max-height: 150px; object-fit: contain; border-radius: 4px; margin-top: 0.5rem;" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                        <div style="display: none; color: var(--danger-color, #f56565); font-size: 0.9rem; margin-top: 0.5rem;">Chyba načítání obrázku</div>
                    </div>` : ''}
                </div>
                
                <div class="form-group">
                    <label class="form-label">Audio:</label>
                    <div class="media-input-group">
                        <input type="url" class="form-input media-url-input" placeholder="https://example.com/audio.mp3 nebo cesta k lokálnímu souboru"
                            value="${questionData.audio || ''}"
                            onchange="topicBuilder.updateQuestion(${index}, 'audio', this.value)">
                        <button type="button" class="media-file-btn" onclick="topicBuilder.selectAudioFile(${index})">
                            📁 Vybrat soubor
                        </button>
                    </div>
                    <input type="file" class="media-file-input" id="audio-file-${index}" accept="audio/*" style="display: none;" 
                           onchange="topicBuilder.handleAudioFileSelect(${index}, this)">
                    <small class="form-help">Zadejte URL zvukového souboru nebo vyberte lokální soubor. Pro lokální soubory použijte formát: file:///cesta/k/souboru nebo ./soubor.mp3 (pokud je ve stejné složce). Pro audio otázky se časovač nespouští.</small>
                    ${questionData.audio ? `<div class="media-preview" id="audio-preview-${index}">
                        <audio controls style="width: 100%; max-width: 300px; margin-top: 0.5rem;">
                            <source src="${questionData.audio}">
                            Váš prohlížeč nepodporuje přehrávání zvuku.
                        </audio>
                    </div>` : ''}
                </div>
            </div>
        `;

        return div;
    }

    renderEmptyState() {
        const container = document.getElementById('questions-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❓</div>
                <div class="empty-state-text">Zatím nemáte žádné otázky</div>
                <button class="btn-secondary" onclick="topicBuilder.addQuestion()">
                    Přidat první otázku
                </button>
            </div>
        `;
    }

    updatePreview() {
        const themeName = document.getElementById('theme-name').value || 'Nové téma';
        const preview = document.getElementById('json-preview');
        
        const topicData = {
            theme: themeName,
            questions: this.questions
        };

        preview.textContent = JSON.stringify(topicData, null, 2);
    }

    updateDownloadButton() {
        const downloadBtn = document.getElementById('download-btn');
        const themeName = document.getElementById('theme-name').value.trim();
        const hasQuestions = this.questions.length > 0;
        const hasValidQuestions = this.questions.some(q => 
            q.question.trim() && q.answer.trim() && q.explanation.trim()
        );

        downloadBtn.disabled = !themeName || !hasQuestions || !hasValidQuestions;
    }

    downloadJSON() {
        const themeName = document.getElementById('theme-name').value.trim();
        
        if (!themeName) {
            alert('Prosím zadejte název tématu');
            return;
        }

        if (this.questions.length === 0) {
            alert('Prosím přidejte alespoň jednu otázku');
            return;
        }

        // Check if all questions have required fields
        const invalidQuestions = this.questions.filter((q, index) => 
            !q.question.trim() || !q.answer.trim() || !q.explanation.trim()
        );

        if (invalidQuestions.length > 0) {
            alert('Prosím vyplňte všechna povinná pole (otázka, odpověď, vysvětlení) u všech otázek');
            return;
        }

        const topicData = {
            theme: themeName,
            questions: this.questions
        };

        const jsonString = JSON.stringify(topicData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${themeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // Show success message
        this.showMessage('✅ Soubor byl úspěšně stažen!', 'success');
    }

    async loadJSON(file) {
        if (!file) return;

        try {
            const text = await file.text();
            let data = JSON.parse(text);

            // Handle array format - if it's an array with a single object, extract it
            if (Array.isArray(data)) {
                if (data.length === 1 && typeof data[0] === 'object' && data[0] !== null) {
                    data = data[0];
                } else if (data.length === 0) {
                    throw new Error('Pole je prázdné');
                } else {
                    throw new Error('Pole obsahuje více než jeden objekt. Prosím použijte soubor s jedním tématem.');
                }
            }

            // Validate the structure
            if (!data.theme || !Array.isArray(data.questions)) {
                throw new Error('Neplatný formát souboru - očekává se objekt s vlastnostmi "theme" a "questions"');
            }

            // Validate questions structure
            const invalidQuestions = data.questions.filter(q => 
                typeof q.question !== 'string' ||
                typeof q.answer !== 'string' ||
                typeof q.explanation !== 'string' ||
                typeof q.source !== 'string' ||
                typeof q.difficulty !== 'string' ||
                // Optional fields - if present, must be strings
                (q.hasOwnProperty('image') && typeof q.image !== 'string') ||
                (q.hasOwnProperty('audio') && typeof q.audio !== 'string')
            );

            if (invalidQuestions.length > 0) {
                throw new Error('Některé otázky mají neplatnou strukturu');
            }

            // Ensure all questions have the new fields, even if empty
            data.questions.forEach(q => {
                if (!q.hasOwnProperty('image')) q.image = '';
                if (!q.hasOwnProperty('audio')) q.audio = '';
            });

            // Load the data
            document.getElementById('theme-name').value = data.theme;
            this.questions = data.questions;
            
            this.renderQuestions();
            this.updatePreview();
            this.updateDownloadButton();

            this.showMessage('✅ Soubor byl úspěšně načten!', 'success');

        } catch (error) {
            console.error('Error loading JSON:', error);
            this.showMessage('❌ Chyba při načítání souboru: ' + error.message, 'error');
        }

        // Clear the file input
        document.getElementById('json-file-input').value = '';
    }

    async loadFromClipboard() {
        try {
            // Check if clipboard API is available
            if (!navigator.clipboard || !navigator.clipboard.readText) {
                throw new Error('Clipboard API není dostupná v tomto prohlížeči nebo prostředí. Použijte HTTPS nebo localhost.');
            }

            // Read text from clipboard
            const clipboardText = await navigator.clipboard.readText();
            
            if (!clipboardText.trim()) {
                throw new Error('Schránka je prázdná');
            }

            // Parse JSON
            let data = JSON.parse(clipboardText);

            // Handle array format - if it's an array with a single object, extract it
            if (Array.isArray(data)) {
                if (data.length === 1 && typeof data[0] === 'object' && data[0] !== null) {
                    data = data[0];
                } else if (data.length === 0) {
                    throw new Error('Pole je prázdné');
                } else {
                    throw new Error('Pole obsahuje více než jeden objekt. Prosím použijte soubor s jedním tématem.');
                }
            }

            // Validate the structure
            if (!data.theme || !Array.isArray(data.questions)) {
                throw new Error('Neplatný formát dat - očekává se objekt s vlastnostmi "theme" a "questions"');
            }

            // Validate questions structure
            const invalidQuestions = data.questions.filter(q => 
                typeof q.question !== 'string' ||
                typeof q.answer !== 'string' ||
                typeof q.explanation !== 'string' ||
                typeof q.source !== 'string' ||
                typeof q.difficulty !== 'string' ||
                // Optional fields - if present, must be strings
                (q.hasOwnProperty('image') && typeof q.image !== 'string') ||
                (q.hasOwnProperty('audio') && typeof q.audio !== 'string')
            );

            if (invalidQuestions.length > 0) {
                throw new Error('Některé otázky mají neplatnou strukturu');
            }

            // Ensure all questions have the new fields, even if empty
            data.questions.forEach(q => {
                if (!q.hasOwnProperty('image')) q.image = '';
                if (!q.hasOwnProperty('audio')) q.audio = '';
            });

            // Load the data
            document.getElementById('theme-name').value = data.theme;
            this.questions = data.questions;
            
            this.renderQuestions();
            this.updatePreview();
            this.updateDownloadButton();

            this.showMessage('✅ Data byla úspěšně načtena ze schránky!', 'success');

        } catch (error) {
            console.error('Error loading from clipboard:', error);
            
            let errorMessage = 'Chyba při načítání ze schránky: ';
            
            if (error.name === 'SyntaxError') {
                errorMessage += 'Neplatný JSON formát';
            } else if (error.name === 'NotAllowedError') {
                errorMessage += 'Přístup ke schránce byl odepřen. Ujistěte se, že stránka běží na HTTPS nebo localhost.';
            } else {
                errorMessage += error.message;
            }
            
            this.showMessage('❌ ' + errorMessage, 'error');
        }
    }

    clearAll() {
        if (this.questions.length === 0 && !document.getElementById('theme-name').value) {
            return;
        }

        if (confirm('Opravdu chcete vymazat všechna data? Tato akce je nevratná.')) {
            document.getElementById('theme-name').value = '';
            this.questions = [];
            this.renderEmptyState();
            this.updatePreview();
            this.updateDownloadButton();

            this.showMessage('🗑️ Všechna data byla vymazána', 'info');
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.background = 'var(--success-color, #48bb78)';
                break;
            case 'error':
                messageEl.style.background = 'var(--danger-color, #f56565)';
                break;
            case 'info':
            default:
                messageEl.style.background = 'var(--primary-color, #667eea)';
                break;
        }

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    showDetailedMessage(message, type = 'info') {
        // Create a more detailed message modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            padding: 2rem;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: var(--dark-bg, #1a1a2e);
            color: var(--text-primary, white);
            padding: 2rem;
            border-radius: 15px;
            max-width: 500px;
            width: 100%;
            border: 2px solid var(--primary-color, #667eea);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;
        
        content.innerHTML = `
            <h3 style="margin: 0 0 1rem 0; color: var(--primary-color, #667eea);">Informace o souboru</h3>
            <pre style="white-space: pre-wrap; font-family: inherit; margin: 0 0 1.5rem 0; line-height: 1.5;">${message}</pre>
            <button onclick="this.closest('[style*=fixed]').remove()" 
                    style="background: var(--primary-color, #667eea); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; font-weight: 600;">
                Rozumím
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 10000);
    }
}

// Initialize the topic builder when the page loads
const topicBuilder = new TopicBuilder();

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to download
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!document.getElementById('download-btn').disabled) {
            topicBuilder.downloadJSON();
        }
    }
    
    // Ctrl/Cmd + N to add new question
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        topicBuilder.addQuestion();
    }
});

// Auto-save to localStorage
function autoSave() {
    const themeName = document.getElementById('theme-name').value;
    const data = {
        theme: themeName,
        questions: topicBuilder.questions,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('topicBuilder_autosave', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Load autosave on page load
window.addEventListener('load', () => {
    try {
        const autosave = localStorage.getItem('topicBuilder_autosave');
        if (autosave) {
            const data = JSON.parse(autosave);
            const timeDiff = Date.now() - data.timestamp;
            
            // Only restore if autosave is less than 24 hours old
            if (timeDiff < 24 * 60 * 60 * 1000) {
                if (data.theme || data.questions.length > 0) {
                    if (confirm('Byla nalezena automaticky uložená data. Chcete je obnovit?')) {
                        document.getElementById('theme-name').value = data.theme || '';
                        topicBuilder.questions = data.questions || [];
                        topicBuilder.renderQuestions();
                        topicBuilder.updatePreview();
                        topicBuilder.updateDownloadButton();
                    }
                }
            }
        }
    } catch (e) {
        console.warn('Could not load autosave:', e);
    }
});

// Clear autosave when leaving page
window.addEventListener('beforeunload', () => {
    try {
        localStorage.removeItem('topicBuilder_autosave');
    } catch (e) {
        console.warn('Could not clear autosave:', e);
    }
}); 